/**
 * Shared next/image loader.
 *
 * NFT artwork is served from arbitrary, unpredictable hosts (IPFS gateways,
 * Arweave, per-project CDNs). Routing those through Next's image optimizer
 * would require whitelisting every host and would break for any that aren't
 * listed or that block hotlinking. This loader returns the source URL
 * unchanged so images always load, while next/image still provides lazy
 * loading and responsive `sizes`.
 */
export const nftImageLoader = ({ src }: { src: string }) => src;
