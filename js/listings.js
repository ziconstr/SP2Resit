import { API_BASE, fetchData } from "/js/api.js";

const grid = document.getElementById("listings-grid");
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const listingCount = document.getElementById("listing-count");

function showSkeletons() {
  grid.innerHTML = Array(8).fill(`
    <div class="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
      <div class="w-full h-44 bg-gray-200"></div>
      <div class="p-4 space-y-2">
        <div class="h-4 bg-gray-200 rounded w-3/4"></div>
        <div class="h-3 bg-gray-100 rounded w-full"></div>
        <div class="h-3 bg-gray-100 rounded w-2/3"></div>
      </div>
    </div>
  `).join("");
}

async function getListings(query = "") {
  const url = query
    ? `${API_BASE}/auction/listings/search?q=${query}&_seller=true&_bids=true&_active=true`
    : `${API_BASE}/auction/listings?_seller=true&_bids=true&_active=true&limit=24&sort=created&sortOrder=desc`;

  const data = await fetchData(url);
  return data.data;
}

function renderListings(listings) {
  if (!listings || !listings.length) {
    grid.innerHTML = `
      <div class="col-span-4 text-center py-16">
        <p class="text-gray-400 text-lg">No listings found.</p>
      </div>`;
    return;
  }

  if (listingCount) {
    listingCount.textContent = `${listings.length} listings found`;
  }

  grid.innerHTML = listings.map((listing) => {
    const image = listing.media?.[0]?.url || "https://placehold.co/400x300?text=No+Image";
    const bids = listing._count?.bids || 0;
    const deadline = new Date(listing.endsAt).toLocaleDateString("no-NO");
    const sellerName = listing.seller?.name || "Unknown";

    return `
      <a href="/listing.html?id=${listing.id}"
        class="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col group">
        <div class="relative overflow-hidden">
          <img
            src="${image}"
            alt="${listing.title}"
            class="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
            onerror="this.src='https://placehold.co/400x300?text=No+Image'"
          />
          <span class="absolute top-2 right-2 bg-[#0063FB] text-white text-xs font-semibold px-2 py-1 rounded-full shadow">
            ${bids} bid${bids !== 1 ? "s" : ""}
          </span>
        </div>
        <div class="p-4 flex flex-col flex-1">
          <h2 class="font-bold text-gray-800 text-base truncate">${listing.title}</h2>
          <p class="text-gray-400 text-xs mt-1 line-clamp-2 flex-1">${listing.description || "No description provided."}</p>
          <div class="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center text-xs">
            <span class="text-gray-400">By <strong class="text-gray-600">${sellerName}</strong></span>
            <span class="text-[#0063FB] font-semibold">Ends ${deadline}</span>
          </div>
        </div>
      </a>
    `;
  }).join("");
}

async function init(query = "") {
  showSkeletons();
  try {
    const listings = await getListings(query);
    renderListings(listings);
  } catch (err) {
    grid.innerHTML = `
      <div class="col-span-4 text-center py-16">
        <p class="text-red-400">Failed to load listings: ${err.message}</p>
      </div>`;
  }
}

searchBtn.addEventListener("click", () => {
  init(searchInput.value.trim());
});

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") init(searchInput.value.trim());
});

init();