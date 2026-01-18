export function formatDate(isoString: string) {
    return new Date(isoString).toLocaleString();
}