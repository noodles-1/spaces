export function formatDownloadSpeed(bits: number, seconds: number): string {
    if (seconds <= 0) return "";

    const bps = bits / seconds;

    if (bps < 1_000) {
        return `${bps.toFixed(0)} bps`;
    } 
    if (bps < 1_000_000) {
        return `${(bps / 1_000).toFixed(1)} Kbps`;
    } 
    if (bps < 1_000_000_000) {
        return `${(bps / 1_000_000).toFixed(1)} Mbps`;
    } 
    return `${(bps / 1_000_000_000).toFixed(1)} Gbps`;
}