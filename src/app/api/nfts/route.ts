import { NextRequest, NextResponse } from 'next/server';

interface NFT {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  attributes?: Array<{ trait_type: string; value: string }>;
}

interface HeliusNFTResponse {
  error?: {
    code: number;
    message: string;
  };
  result?: {
    items: Array<{
      id: string;
      content: {
        metadata: {
          name: string;
          description: string;
          attributes?: Array<{ trait_type: string; value: string }>;
        };
        links: {
          image: string;
        };
      };
    }>;
  };
}

type Data = {
  success: boolean;
  message: string;
  nfts?: NFT[];
  error?: string;
};

async function fetchNonFungibleAssetsByOwner(address: string, page: number = 1, limit: number = 1000) {
  const apiKey = process.env.HELIUS_API_KEY;
  if (!apiKey) {
    throw new Error('Helius API key is not configured. Set HELIUS_API_KEY.');
  }
  const url = `https://mainnet.helius-rpc.com/?api-key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 'my-id',
      method: 'getAssetsByOwner',
      params: {
        ownerAddress: address,
        page: page,
        limit: limit,
        displayOptions: {
          showFungible: false,
        },
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error fetching NFTs from Helius: ${errorText}`);
  }

  const data = (await response.json()) as HeliusNFTResponse;

  // Helius returns rate-limit / quota errors inside a 200 OK JSON-RPC body, so
  // surface them explicitly instead of letting `result` be undefined downstream.
  if (data.error) {
    if (data.error.code === -32429 || /max usage|rate limit/i.test(data.error.message)) {
      throw new Error('Helius API quota exceeded. The RPC key has hit its usage limit.');
    }
    throw new Error(`Helius error: ${data.error.message}`);
  }

  return data;
}

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get('address');

  // Check if the address is literally the string "null" or is null/empty
  if (!address || address.trim() === '' || address === 'null') {
    return NextResponse.json(
      { success: false, message: 'Wallet address is required and must be a valid string' },
      { status: 400 }
    );
  }

  try {
    const data = await fetchNonFungibleAssetsByOwner(address);

    const nfts: NFT[] = (data.result?.items ?? []).map((item) => ({
      id: item.id,
      title: item.content.metadata.name || 'Untitled',
      description: item.content.metadata.description || 'No description available.',
      imageUrl: item.content.links.image || '',
      attributes: item.content.metadata.attributes || [],
    }));

    return NextResponse.json({
      success: true,
      message: 'NFTs fetched successfully',
      nfts,
    });
  } catch (err) {
    const error = err as Error;
    console.error('Error fetching NFTs:', error.message);
    return NextResponse.json({ success: false, message: error.message || 'Server error', error: error.message }, { status: 500 });
  }
}
