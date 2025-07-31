<script>
    import { onMount } from "svelte";
    import { getDeviceFingerprint } from '$lib/deviceFingerprint.js';

    // Props for the component
    const { data } = $props();

    // Reactive state for managing the UI
    let deviceId = $state(null);
    let currentStatus = $state("Initializing...");
    let isLoading = $state(true); // Control the visibility of the loading animation
    let redirecting = $state(false); // To show a final redirecting message

    onMount(async () => {
        $inspect('dt', data); // For development inspection

        // --- Step 1: Validating Device ---
        currentStatus = "Validating device...";
        deviceId = await getDeviceFingerprint();

        // Get the user's IP address
        let ip = '';
        try {
            const res = await fetch('https://api.ipify.org?format=json');
            const json = await res.json();
            ip = json.ip;
        } catch (e) {
            console.error('Failed to get IP:', e);
            // Optionally, you might want to display an error status to the user
            // currentStatus = "Error getting IP address.";
        }

        if (deviceId) {
            console.log('Device ID:', data.code);
            // Optionally store it in localStorage
            localStorage.setItem('device_id', deviceId);

            // --- Step 2: Checking Record & Validating Link & Accessing Link Risk ---
            currentStatus = "Checking record and validating link...";
            try {
                const res = await fetch(`/api/links/redirect/${data.code}`, {
                    method: 'POST',
                    body: JSON.stringify({ deviceId }),
                    headers: ip ? { 'x-real-ip': ip } : undefined
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.message || `HTTP error! Status: ${res.status}`);
                }

                const dta = await res.json();
                console.log('Redirect Data:', dta);

                if (dta.redirectUrl) {
                    // --- Step 3: Updating Record & Redirecting ---
                    currentStatus = "Updating record and redirecting...";
                    redirecting = true; // Show the final redirecting message
                    isLoading = false; // Hide loading animation before redirect

                    // A small delay to allow the user to see the "redirecting" message
                    setTimeout(() => {
                        window.location.href = dta.redirectUrl;
                    }, 1500); // 1.5 second delay
                } else {
                    currentStatus = "Link validation failed or no redirect URL found.";
                    isLoading = false; // Stop loading animation on failure
                }
            } catch (error) {
                console.error('Error during link validation/redirection:', error);
                currentStatus = `Error: ${error.message || 'Failed to process link.'}`;
                isLoading = false; // Stop loading animation on error
            }
        } else {
            currentStatus = "Could not generate device ID. Please try again.";
            isLoading = false; // Stop loading animation if deviceId is not available
        }
    });
</script>

<div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800 p-4 box-border font-sans">
    {#if isLoading}
        <div class="text-center mb-8 bg-white p-10 rounded-lg shadow-xl min-w-[300px]">
            <div class="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16 mb-4 mx-auto"></div>
            <p class="text-xl mt-5 text-gray-700">{currentStatus}</p>
        </div>
    {:else if redirecting}
        <div class="text-center mb-8 bg-white p-10 rounded-lg shadow-xl min-w-[300px]">
            <p class="text-xl">{currentStatus}</p>
            <p class="mt-2 text-lg text-gray-600">Please wait while we redirect you...</p>
        </div>
    {:else}
        <div class="text-center mb-8 bg-white p-10 rounded-lg shadow-xl min-w-[300px]">
            <p class="text-xl text-red-600 font-semibold">{currentStatus}</p>
            {#if !deviceId}
                <p class="mt-2 text-lg text-gray-600">Ensure your browser supports device fingerprinting.</p>
            {/if}
        </div>
    {/if}

    <div class="w-full max-w-md h-40 bg-gray-200 border-2 border-dashed border-gray-400 flex items-center justify-center cursor-pointer rounded-lg transition-colors hover:bg-gray-300">
        <p class="text-lg text-gray-600 font-bold select-none">Click to put your ads here</p>
    </div>
</div>

<style>
    /* Custom keyframes for the spinner (Tailwind doesn't provide this directly) */
    @keyframes spin {
        0% { transform: rotate(0deg); border-top-color: #3B82F6; } /* Tailwind blue-500 */
        100% { transform: rotate(360deg); border-top-color: #3B82F6; }
    }

    .loader {
        animation: spin 1.5s linear infinite; /* Increased duration for smoother spin */
    }
</style>