<script>
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  
  const { data } = $props();
  let user = $derived(data.user);
  
  let showModal = $state(false);
  let loading = $state(false);
  let links = $state([]);
  let stats = $state({
    totalLinks: 0,
    totalReferrals: 0
  });
  
  // Form state
  let formData = $state({
    title: '',
    originalUrl: '',
    description: '',
    category: 'general',
    pointsPerClick: 1,
    expiresAt: ''
  });
  
  let formErrors = $state({});
  
  onMount(async () => {
    await loadDashboardData();
  });
  
  async function loadDashboardData() {
    try {
      const response = await fetch('/api/dashboard');
      if (response.ok) {
        const data = await response.json();
        links = data.links;
        stats = data.stats;
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  }
  
  function openModal() {
    showModal = true;
    // Reset form
    formData = {
      title: '',
      originalUrl: '',
      description: '',
      category: 'general',
      pointsPerClick: 1,
      expiresAt: ''
    };
    formErrors = {};
  }
  
  function closeModal() {
    showModal = false;
    formErrors = {};
  }
  
  function validateForm() {
    const errors = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }
    
    if (!formData.originalUrl.trim()) {
      errors.originalUrl = 'URL is required';
    } else {
      try {
        new URL(formData.originalUrl);
      } catch {
        errors.originalUrl = 'Please enter a valid URL';
      }
    }
    
    if (formData.pointsPerClick < 1 || formData.pointsPerClick > 100) {
      errors.pointsPerClick = 'Points per click must be between 1 and 100';
    }
    
    if (formData.expiresAt && new Date(formData.expiresAt) <= new Date()) {
      errors.expiresAt = 'Expiration date must be in the future';
    }
    
    return errors;
  }
  
  async function handleSubmit() {
    const errors = validateForm();
    formErrors = errors;
    
    if (Object.keys(errors).length > 0) {
      return;
    }
    
    loading = true;
    
    try {
      const response = await fetch('/api/links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        const newLink = await response.json();
        links = [newLink, ...links];
        stats.totalLinks += 1;
        closeModal();
      } else {
        const error = await response.json();
        formErrors = error.errors || { general: 'Failed to create link' };
      }
    } catch (error) {
      console.error('Failed to create link:', error);
      formErrors = { general: 'Network error. Please try again.' };
    } finally {
      loading = false;
    }
  }
  
  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  }
</script>

<svelte:head>
  <title>Dashboard - Referral Tracker</title>
</svelte:head>

<div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
  <div class="px-4 py-6 sm:px-0">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">
        Welcome back, {user.username}!
      </h1>
      <button
        onclick={openModal}
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
        </svg>
        Create New Link
      </button>
    </div>
    
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-indigo-600 rounded-md flex items-center justify-center">
                <span class="text-white font-bold">P</span>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Total Points</dt>
                <dd class="text-lg font-medium text-gray-900">{user.totalPoints}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
      
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-green-600 rounded-md flex items-center justify-center">
                <span class="text-white font-bold">L</span>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Links Created</dt>
                <dd class="text-lg font-medium text-gray-900">{stats.totalLinks}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
      
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-yellow-600 rounded-md flex items-center justify-center">
                <span class="text-white font-bold">R</span>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Referrals</dt>
                <dd class="text-lg font-medium text-gray-900">{stats.totalReferrals}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Links List -->
    <div class="bg-white shadow overflow-hidden sm:rounded-md">
      <div class="px-4 py-5 sm:px-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900">Your Links</h3>
        <p class="mt-1 max-w-2xl text-sm text-gray-500">Manage and track your created links</p>
      </div>
      
      {#if links.length === 0}
        <div class="px-4 py-8 text-center">
          <p class="text-gray-500">No links created yet. Create your first link to get started!</p>
        </div>
      {:else}
        <ul class="divide-y divide-gray-200">
          {#each links as link}
            <li class="px-4 py-4 sm:px-6">
              <div class="flex items-center justify-between">
                <div class="flex-1 min-w-0">
                  <div class="flex items-center">
                    <p class="text-sm font-medium text-indigo-600 truncate">
                      {link.title}
                    </p>
                    <span class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {link.category}
                    </span>
                  </div>
                  <div class="mt-1 flex items-center text-sm text-gray-500">
                    <span class="truncate">{link.originalUrl}</span>
                    <span class="mx-2">•</span>
                    <span>{link.totalClicks} clicks</span>
                    <span class="mx-2">•</span>
                    <span>{link.pointsPerClick} points per click</span>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <button
                    onclick={() => copyToClipboard(`${window.location.origin}/l/${link.shortCode}`)}
                    class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Copy Link
                  </button>
                  <button
                    onclick={() => goto(`/links/${link._id}`)}
                    class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </li>
          {/each}
        </ul>
      {/if}
    </div>
  </div>
</div>

<!-- Modal -->
{#if showModal}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" onclick={closeModal}>
    <div class="relative top-20 mx-auto p-5 border w-full max-w-md bg-white rounded-md shadow-lg" onclick={(e) => e.stopPropagation()}>
      <div class="mt-3">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">Create New Link</h3>
          <!-- svelte-ignore a11y_consider_explicit_label -->
          <button onclick={closeModal} class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="space-y-4">
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              id="title"
              bind:value={formData.title}
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3"
              placeholder="Enter link title"
            />
            {#if formErrors.title}
              <p class="mt-1 text-sm text-red-600">{formErrors.title}</p>
            {/if}
          </div>
          
          <div>
            <label for="originalUrl" class="block text-sm font-medium text-gray-700">Original URL</label>
            <input
              type="url"
              id="originalUrl"
              bind:value={formData.originalUrl}
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3"
              placeholder="https://example.com"
            />
            {#if formErrors.originalUrl}
              <p class="mt-1 text-sm text-red-600">{formErrors.originalUrl}</p>
            {/if}
          </div>
          
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700">Description (Optional)</label>
            <textarea
              id="description"
              bind:value={formData.description}
              rows="3"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3"
              placeholder="Describe what this link is about"
            ></textarea>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="category" class="block text-sm font-medium text-gray-700">Category</label>
              <select
                id="category"
                bind:value={formData.category}
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3"
              >
                <option value="general">General</option>
                <option value="promotion">Promotion</option>
                <option value="content">Content</option>
                <option value="product">Product</option>
                <option value="event">Event</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label for="pointsPerClick" class="block text-sm font-medium text-gray-700">Points per Click</label>
              <input
                type="number"
                id="pointsPerClick"
                bind:value={formData.pointsPerClick}
                min="1"
                max="100"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3"
              />
              {#if formErrors.pointsPerClick}
                <p class="mt-1 text-sm text-red-600">{formErrors.pointsPerClick}</p>
              {/if}
            </div>
          </div>
          
          <div>
            <label for="expiresAt" class="block text-sm font-medium text-gray-700">Expires At (Optional)</label>
            <input
              type="datetime-local"
              id="expiresAt"
              bind:value={formData.expiresAt}
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3"
            />
            {#if formErrors.expiresAt}
              <p class="mt-1 text-sm text-red-600">{formErrors.expiresAt}</p>
            {/if}
          </div>
          
          {#if formErrors.general}
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {formErrors.general}
            </div>
          {/if}
          
          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onclick={closeModal}
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Link'}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
{/if}