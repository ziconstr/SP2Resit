import { API_BASE, fetchData } from "/js/api.js";

const container = document.getElementById("listing-container");

function getIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function getProfile() {
  const profile = localStorage.getItem("profile");
  return profile ? JSON.parse(profile) : null;
}

async function getListing(id) {
  const data = await fetchData(`${API_BASE}/auction/listings/${id}?_seller=true&_bids=true`);
  return data.data;
}

async function placeBid(id, amount) {
  return await fetchData(`${API_BASE}/auction/listings/${id}/bids`, {
    method: "POST",
    body: JSON.stringify({ amount }),
  });
}

function renderListing(listing) {
  const profile = getProfile();
  const isLoggedIn = !!localStorage.getItem("token");
  const isOwner = profile?.name === listing.seller?.name;
  const image = listing.media?.[0]?.url || "https://placehold.co/800x400?text=No+Image";
  const deadline = new Date(listing.endsAt).toLocaleDateString("no-NO");
  const bids = listing.bids || [];
  const highestBid = bids.length ? Math.max(...bids.map(b => b.amount)) : 0;

  container.innerHTML = `
    <img
      src="${image}"
      alt="${listing.title}"
      class="w-full h-72 object-cover"
      onerror="this.src='https://placehold.co/800x400?text=No+Image'"
    />
    <div class="p-8">
      <div class="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 class="text-2xl font-extrabold text-gray-800">${listing.title}</h1>
          <p class="text-sm text-gray-400 mt-1">By <strong class="text-gray-600">${listing.seller?.name || "Unknown"}</strong></p>
        </div>
        <div class="text-right">
          <p class="text-xs text-gray-400">Ends</p>
          <p class="text-[#0063FB] font-bold">${deadline}</p>
        </div>
      </div>

      <p class="text-gray-600 mt-4 text-sm leading-relaxed">${listing.description || "No description provided."}</p>

      <div class="mt-6 bg-gray-50 rounded-xl p-4 flex items-center justify-between">
        <div>
          <p class="text-xs text-gray-400">Current highest bid</p>
          <p class="text-2xl font-extrabold text-[#0063FB]">${highestBid} credits</p>
        </div>
        <div>
          <p class="text-xs text-gray-400">Total bids</p>
          <p class="text-2xl font-extrabold text-gray-700">${bids.length}</p>
        </div>
      </div>

      ${isLoggedIn && !isOwner ? `
        <div class="mt-6 flex gap-3">
          <input
            type="number"
            id="bid-amount"
            placeholder="Enter bid amount"
            min="${highestBid + 1}"
            class="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0063FB]"
          />
          <button
            id="bid-btn"
            class="bg-[#0063FB] hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-lg transition text-sm">
            Place bid
          </button>
        </div>
        <div id="bid-error" class="hidden bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mt-3"></div>
        <div id="bid-success" class="hidden bg-green-50 border border-green-200 text-green-600 text-sm rounded-lg px-4 py-3 mt-3"></div>
      ` : !isLoggedIn ? `
        <div class="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-700">
          <a href="/login.html" class="font-bold underline">Log in</a> to place a bid on this listing.
        </div>
      ` : `
        <div class="mt-6 bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-500">
          You cannot bid on your own listing.
        </div>
      `}

      ${bids.length ? `
        <div class="mt-8">
          <h2 class="text-lg font-bold text-gray-700 mb-4">Bid history</h2>
          <div class="space-y-2">
            ${[...bids].sort((a, b) => b.amount - a.amount).map(bid => `
              <div class="flex justify-between items-center bg-gray-50 rounded-lg px-4 py-3 text-sm">
                <span class="font-medium text-gray-700">${bid.bidder?.name || "Unknown"}</span>
                <span class="text-[#0063FB] font-bold">${bid.amount} credits</span>
              </div>
            `).join("")}
          </div>
        </div>
      ` : `
        <p class="text-gray-400 text-sm mt-8">No bids yet. Be the first!</p>
      `}
    </div>
  `;

  if (isLoggedIn && !isOwner) {
    const bidBtn = document.getElementById("bid-btn");
    const bidError = document.getElementById("bid-error");
    const bidSuccess = document.getElementById("bid-success");

    bidBtn.addEventListener("click", async () => {
      const amount = parseInt(document.getElementById("bid-amount").value);
      bidError.classList.add("hidden");
      bidSuccess.classList.add("hidden");

      if (!amount || amount <= highestBid) {
        bidError.textContent = `Bid must be higher than ${highestBid} credits.`;
        bidError.classList.remove("hidden");
        return;
      }

      bidBtn.textContent = "Placing bid...";
      bidBtn.disabled = true;

      try {
        await placeBid(listing.id, amount);
        bidSuccess.textContent = "Bid placed successfully! Reloading...";
        bidSuccess.classList.remove("hidden");
        setTimeout(() => window.location.reload(), 1500);
      } catch (err) {
        bidError.textContent = err.message;
        bidError.classList.remove("hidden");
        bidBtn.textContent = "Place bid";
        bidBtn.disabled = false;
      }
    });
  }
}

async function init() {
  const id = getIdFromUrl();
  if (!id) {
    container.innerHTML = `<p class="text-red-400 p-8">No listing ID found.</p>`;
    return;
  }

  try {
    const listing = await getListing(id);
    renderListing(listing);
  } catch (err) {
    container.innerHTML = `<p class="text-red-400 p-8">Failed to load listing: ${err.message}</p>`;
  }
}

init();