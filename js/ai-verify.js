export async function startCapture() {
    return await navigator.mediaDevices.getDisplayMedia({ video: true });
}
