<script>
  import '../app.css';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  
  let { children, data } = $props();
  let user = $derived(data.user)
  async function handleLogout() {
    const response = await fetch('/auth/logout', {
      method: 'POST'
    });
    
    if (response.ok) {
      goto('/login');
    }
    
    // $inspect(response.json())
  }
  
  onMount(async() => {
    //  
    //  await handleLogout()
  });

  let showMenu = $state(false)
</script>

<div class="min-h-screen bg-gray-50">
  <nav class="bg-white shadow">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16 items-center">
        <div class="flex items-center">
          <a href={user ? "/dashboard" : "/"} class="text-xl font-bold text-gray-900">
            Tree-Trace
          </a>
        </div>

        <!-- Mobile menu button -->
        <div class="flex md:hidden">
          <button
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            aria-label="Open main menu"
            onclick={() => showMenu = !showMenu}
          >
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        <!-- Desktop menu -->
        <div class="hidden md:flex items-center space-x-4">
          {#if user}
            <span class="text-sm text-gray-600">
              Points: <span class="font-semibold text-indigo-600">{user.totalPoints}</span>
            </span>
            <div class="flex items-center space-x-2">
              {#if user.avatar}
                <img src={user.avatar} alt={user.username} class="w-8 h-8 rounded-full" />
              {/if}
              <span class="text-sm font-medium text-gray-900">{user.username}</span>
            </div>
            <button
              onclick={handleLogout}
              class="text-sm text-gray-500 hover:text-gray-700"
            >
              Logout
            </button>
          {:else}
            <a
              href="/login"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Sign In
            </a>
          {/if}
        </div>
      </div>
    </div>

    <!-- Mobile menu, show/hide based on menu state. -->
    {#if showMenu}
      <div class="md:hidden px-4 pb-4">
        <div class="flex flex-col space-y-2">
          {#if user}
            <span class="text-sm text-gray-600">
              Points: <span class="font-semibold text-indigo-600">{user.totalPoints}</span>
            </span>
            <div class="flex items-center space-x-2">
              {#if user.avatar}
                <img src={user.avatar} alt={user.username} class="w-8 h-8 rounded-full" />
              {/if}
              <span class="text-sm font-medium text-gray-900">{user.username}</span>
            </div>
            <button
              onclick={handleLogout}
              class="text-sm text-gray-500 hover:text-gray-700 text-left"
            >
              Logout
            </button>
          {:else}
            <a
              href="/login"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Sign In
            </a>
          {/if}
        </div>
      </div>
    {/if}

    <script>
      let showMenu = false;
    </script>
  </nav>
  
  <main class=" md:p-10 p-4">
    {@render children()}
  </main>
</div>