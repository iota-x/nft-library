/**
 * Shared Solana NFT (DAS asset) shapes and mapping helpers used by the API
 * routes. The DAS asset returned by `getAssetsByOwner` / `getAssetsByGroup` /
 * `getAsset` is large and loosely typed; the gallery only needs a small,
 * predictable slice, so we normalise it once here.
 */

export interface Attribute {
  trait_type: string;
  value: string;
}

/** Compact NFT shape used by the gallery grid, analytics and filtering. */
export interface NFTSummary {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  attributes: Attribute[];
  /** Collection address + label (+ artwork), or null for ungrouped (1/1) assets. */
  collection: { name: string; address: string; image?: string } | null;
  compressed: boolean;
  tokenStandard: string | null;
}

/** Minimal slice of a DAS asset we read from. Everything is optional/defensive. */
export interface DasAsset {
  id: string;
  content?: {
    metadata?: {
      name?: string;
      description?: string;
      symbol?: string;
      token_standard?: string;
      attributes?: Attribute[];
    };
    links?: { image?: string; external_url?: string };
    files?: Array<{ uri?: string; cdn_uri?: string }>;
  };
  grouping?: Array<{
    group_key: string;
    group_value: string;
    collection_metadata?: { name?: string; symbol?: string; image?: string };
  }>;
  compression?: { compressed?: boolean };
}

/** First usable image for an asset, preferring CDN-cached files. */
export function assetImage(asset: DasAsset): string {
  return (
    asset.content?.links?.image ||
    asset.content?.files?.find((f) => f.cdn_uri || f.uri)?.cdn_uri ||
    asset.content?.files?.[0]?.uri ||
    ''
  );
}

export function mapAssetToSummary(asset: DasAsset): NFTSummary {
  const meta = asset.content?.metadata ?? {};
  const collectionGroup = asset.grouping?.find((g) => g.group_key === 'collection');
  const collectionMeta = collectionGroup?.collection_metadata;

  return {
    id: asset.id,
    title: meta.name || 'Untitled',
    description: meta.description || 'No description available.',
    imageUrl: assetImage(asset),
    attributes: meta.attributes ?? [],
    collection: collectionGroup
      ? {
          name: collectionMeta?.name || meta.symbol || 'Unknown collection',
          address: collectionGroup.group_value,
          image: collectionMeta?.image,
        }
      : null,
    compressed: asset.compression?.compressed ?? false,
    tokenStandard: meta.token_standard ?? null,
  };
}
