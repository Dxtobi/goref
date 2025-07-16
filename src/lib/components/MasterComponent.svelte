<!-- src/lib/components/ReferralLinks.svelte -->
<script >
  import RefComp from './RefComp.svelte';




 
   let  { resentLink,  } =$props();


   let sampleData = $derived(resentLink)

</script>



<div class="">
  <div class="text-center mb-8">
    <h2 class="text-2xl font-bold text-gray-900 mb-2">Recent Referral Links</h2>
    <p class="text-gray-600">Share these links and earn points for every click!</p>
  </div>

  {#each sampleData as link (link._id)}
    <RefComp {link}></RefComp>
  {/each}

  {#if sampleData.length === 0}
    <div class="text-center py-12">
      <div class="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
        <span class="text-2xl">🔗</span>
      </div>
      <h3 class="text-lg font-semibold text-gray-900 mb-2">No referral links yet</h3>
      <p class="text-gray-600">Create your first referral link to start earning points!</p>
    </div>
  {/if}
</div>
