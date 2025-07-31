// src/lib/deviceFingerprint.js

import { browser } from '$app/environment';

// Function to get unique device fingerprint
export async function getDeviceFingerprint() {
    if (!browser) {
        // Not available server-side
        return null;
    }

    // Dynamically import FingerprintJS (or use CDN if needed)
    const FingerprintJS = await import('@fingerprintjs/fingerprintjs');
    const fp = await FingerprintJS.load();
    const result = await fp.get();

    return result.visitorId;
}