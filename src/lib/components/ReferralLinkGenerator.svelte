<script>
  import { page } from '$app/state';
  import { onMount } from 'svelte';
  
  const  {masterLinkId} = $props();
  
  
  const {data}=page
  $inspect(data, masterLinkId)
  let referralLink = $state(null);
  let loading = $state(false);
  let error = $state(null);
  let user = $derived(data.user)
  
  async function generateReferralLink() {
    loading = true;
    error = null;
    
    try {
      const response = await fetch('/api/links/create-referral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          masterLinkId,
          sharerId:  user.id
        })
      });
      console.log('called')
      const data = await response.json();
      
      if (data.success) {
        referralLink = data.referralLink;
      } else {
        error = data.error || 'Failed to generate referral link';
      }
    } catch (err) {
        console.log(err)
      error = 'Network error occurred';
    } finally {
      loading = false;
    }
  }
  
  function copyToClipboard() {
    if (referralLink) {
      navigator.clipboard.writeText(`${window.location.origin}${referralLink.shareUrl}`);
    }
  }
  
  $effect(() => {
    if (masterLinkId && user.id) {
      console.log('mount')
      generateReferralLink();
    }else{
      console.log('unmount')

    }
  });
</script>

<div class="referral-generator">
  {#if loading}
    <p>Generating referral link...</p>
  {:else if error}
    <p class="error">{error}</p>
    <button onclick={generateReferralLink}>Try Again</button>
  {:else if referralLink}
    <div class="referral-link">
      <h3>Your Referral Link</h3>
      <div class="link-container">
        <input 
          type="text" 
          value="{window.location.origin}{referralLink.shareUrl}" 
          readonly
        />
        <button onclick={copyToClipboard}>Copy</button>
      </div>
      <p class="code">Code: {referralLink.referralCode}</p>
    </div>
  {:else}
    <button onclick={generateReferralLink}>Generate Referral Link</button>
  {/if}
</div>

<style>
  .referral-generator {
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    margin: 1rem 0;
  }
  
  .link-container {
    display: flex;
    gap: 0.5rem;
    margin: 1rem 0;
  }
  
  .link-container input {
    flex: 1;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  .code {
    font-family: monospace;
    background: #f5f5f5;
    padding: 0.25rem;
    border-radius: 4px;
    display: inline-block;
  }
  
  .error {
    color: #d32f2f;
  }
</style>