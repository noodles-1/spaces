export function formatFileSize(bytes: number, decimals = 0) {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;

    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    const size = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

    return `${size} ${sizes[i]}`;
}