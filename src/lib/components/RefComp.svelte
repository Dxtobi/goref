<script >
  import { formatDate } from "$lib/utils/helpers";
  import ReferralLinkGenerator from "./ReferralLinkGenerator.svelte";

   let  { link } =$props();
   let copiedId = $state('')
   let generateLinkCompActive  = $state(false)

   const generateReferral =(link)=>{
        generateLinkCompActive=!generateLinkCompActive
   }

</script>

<div class="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 overflow-hidden"
    >
      <!-- Header with user info -->
      <div class="p-6 pb-4">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <div class="relative">
              <img
                src={link.creator.avatar || "https://placehold.co/40x40/6B7280/FFFFFF?text=User"}
                alt={`${link.creator.username} avatar`}
                class="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100"
               
              />
              <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">@{link.creator.username}</h3>
              <p class="text-sm text-gray-500">{formatDate(link.createdAt)}</p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <span
              class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium {link.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}"
            >
              <span
                class="w-1.5 h-1.5 rounded-full mr-1 {link.isActive ? 'bg-green-500' : 'bg-red-500'}"
              ></span>
              {link.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        <!-- Content -->
        <div class="mb-4">
          <h4 class="font-bold text-lg text-gray-900 mb-2 leading-tight">{link.title}</h4>
          <p class="text-gray-600 text-sm leading-relaxed">{link.description}</p>
        </div>

        <!-- Original URL -->
        <div class="mb-4">
          <a
            href={link.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
          >
            <span class="w-4 h-4 flex items-center justify-center">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </span>
            <span class="truncate max-w-xs">{link.originalUrl}</span>
          </a>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div class="bg-gray-50 rounded-lg p-3 text-center">
            <div class="text-lg font-bold text-gray-900">{link.totalShares}</div>
            <div class="text-xs text-gray-500 font-medium">Shares</div>
          </div>
          <div class="bg-gray-50 rounded-lg p-3 text-center">
            <div class="text-lg font-bold text-gray-900">{link.totalClicks}</div>
            <div class="text-xs text-gray-500 font-medium">Clicks</div>
          </div>
          <div class="bg-gray-50 rounded-lg p-3 text-center">
            <div class="text-lg font-bold text-purple-600">{link.pointsPerClick}</div>
            <div class="text-xs text-gray-500 font-medium">Pts/Click</div>
          </div>
          <div class="bg-gray-50 rounded-lg p-3 text-center">
            <div class="text-sm font-bold text-gray-900 truncate">{link.category}</div>
            <div class="text-xs text-gray-500 font-medium">Category</div>
          </div>
        </div>

        <!-- Short code and expiration -->
        <div class="flex flex-wrap items-center gap-3 mb-4">
          <div class="bg-gray-100 px-3 py-1.5 rounded-lg">
            <span class="text-xs font-mono text-gray-700">/{link.shortCode}</span>
          </div>
          {#if link.expiresAt}
            <div class="flex items-center gap-1 text-xs text-amber-600">
              <span class="w-3 h-3 flex items-center justify-center">⏰</span>
              <span>Expires {formatDate(link.expiresAt)}</span>
            </div>
          {/if}
        </div>
      </div>

      <!-- Action Button -->
      <div class="px-6 pb-6 flex flex-col">
         <a href={``}
          onclick={() => generateReferral(link)}
          class="w-full cursor-pointer text-center border border-purple-400  my-2  font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md"
        > More...
      </a>
        <button
          onclick={() => generateReferral(link)}
          class="w-full cursor-pointer  bg-gradient-to-r from-purple-400 to-purple-600  hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md"
        >
          {#if copiedId === link._id}
            <span class="flex items-center justify-center gap-2">
              <span class="w-4 h-4 flex items-center justify-center">✓</span>
              Referral Link Copied!
            </span>
          {:else}
            <span class="flex items-center justify-center gap-2">
              <span class="w-4 h-4 flex items-center justify-center">🔗</span>
              Get Your Referral Link
            </span>
          {/if}
        </button>
      </div>
</div>

{#if generateLinkCompActive}
    <ReferralLinkGenerator masterLinkId={link._id}  />
{/if}