
<script>
  import MasterComponent from '$lib/components/MasterComponent.svelte';


    const {data} = $props();

    // $inspect(data)

    const resentLinks = $derived(data.resentLinks)
</script>


<div class="flex flex-col gap-4 max-w-md mx-auto px-2">
    
       <MasterComponent  resentLink={resentLinks}/>
   
</div>
