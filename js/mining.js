export function calculateYield(staked, lastSync) {
    const diff = (new Date() - new Date(lastSync)) / 1000;
    return (staked * 0.04 * diff) / 86400;
}
