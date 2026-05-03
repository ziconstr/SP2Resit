import { API_BASE, fetchData } from "/js/api.js";

const container = document.getElementById("profile-container");

function getProfile() {
  const profile = localStorage.getItem("profile");
  return profile ? JSON.parse(profile) : null;
}

async function getProfileData(name) {
  const data = await fetchData(`${API_BASE}/auction/profiles/${name}`);
  return data.data;
}

async function getProfileListings(name) {
  const data = await fetchData(`${API_BASE}/auction/profiles/${name}/listings?_bids=true`);
  return data.data;
}

async function getProfileBids(name) {
  const data = await fetchData(`${API_BASE}/auction/profiles/${name}/bids?_listings=true`);
  return data.data;
}

async function updateProfile(name, body) {
  return await fetchData(`${API_BASE}/auction/profiles/${name}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

function renderProfile(profile, listings, bids) {
  const avatar = profile.avatar?.url || "https://placehold.co/100?text=?";
  const banner = profile.banner?.url || null;

  container.innerHTML = `
    <div class="rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-white mb-6">
      ${banner
        ? `<img src="${banner}" class="w-full h-40 object-cover" alt="banner" />`
        : `<div class="w-full h-40 bg-[#0063FB]"></div>`}
      <div class="px-6 pb-6">
        <div class="flex items-end gap-4 -mt-10 flex-wrap">
          <img src="${avatar}" alt="avatar" class="w-20 h-20 rounded-full border-4 border-white shadow object-cover"
            onerror="this.src='https://placehold.co/100?text=?'" />
          <div class="pb-1">
            <h1 class="text-xl font-extrabold text-gray-800">${profile.name}</h1>
            <p class="text-sm text-gray-400">${profile.email}</p>
          </div>
          <div class="ml-auto pb-1 text-right">
            <p class="text-xs text-gray-400">Credits</p>
            <p class="text-2xl font-extrabold text-[#0063FB]">${profile.credits ?? 0}</p>
          </div>
        </div>
        <p class="text-gray-500 text-sm mt-3">${profile.bio || "No bio yet."}</p>
      </div>
    </div>

    <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
      <h2 class="text-lg font-bold text-gray-700 mb-4">Edit profile</h2>
      <div class="space-y-3">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Bio</label>
          <input type="text" id="edit-bio" value="${profile.bio || ""}" placeholder="Your bio"
            class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0063FB]" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Avatar URL</label>
          <input type="text" id="edit-avatar" value="${profile.avatar?.url || ""}" placeholder="https://..."
            class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0063FB]" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Banner URL</label>
          <input type="text" id="edit-banner" value="${profile.banner?.url || ""}" placeholder="https://..."
            class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0063FB]" />
        </div>
        <div id="edit-error" class="hidden bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3"></div>
        <div id="edit-success" class="hidden bg-green-50 border border-green-200 text-green-600 text-sm rounded-lg px-4 py-3"></div>
        <button id="edit-btn" class="bg-[#0063FB] hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-lg transition text-sm">
          Save changes
        </button>
      </div>
    </div>

    <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
      <h2 class="text-lg font-bold text-gray-700 mb-4">My listings (${listings.length})</h2>
      ${listings.length ? `
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          ${listings.map(listing => {
            const image = listing.media?.[0]?.url || "https://placehold.co/400x200?text=No+Image";
            const bidsCount = listing._count?.bids || 0;
            const deadline = new Date(listing.endsAt).toLocaleDateString("no-NO");
            return `
              <a href="/listing.html?id=${listing.id}" class="flex gap-3 border border-gray-100 rounded-xl p-3 hover:shadow transition">
                <img src="${image}" alt="${listing.title}" class="w-20 h-20 object-cover rounded-lg"
                  onerror="this.src='https://placehold.co/400x200?text=No+Image'" />
                <div class="flex flex-col justify-between">
                  <p class="font-semibold text-gray-800 text-sm">${listing.title}</p>
                  <p class="text-xs text-gray-400">Bids: <strong>${bidsCount}</strong></p>
                  <p class="text-xs text-[#0063FB]">Ends ${deadline}</p>
                </div>
              </a>
            `;
          }).join("")}
        </div>
      ` : `<p class="text-gray-400 text-sm">You have no listings yet.</p>`}
    </div>

    <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <h2 class="text-lg font-bold text-gray-700 mb-4">My bids (${bids.length})</h2>
      ${bids.length ? `
        <div class="space-y-2">
          ${bids.map(bid => {
            const listing = bid.listing;
            if (!listing) return "";
            return `
              <a href="/listing.html?id=${listing.id}" class="flex justify-between items-center bg-gray-50 rounded-lg px-4 py-3 text-sm hover:shadow transition">
                <span class="font-medium text-gray-700">${listing.title}</span>
                <span class="text-[#0063FB] font-bold">${bid.amount} credits</span>
              </a>
            `;
          }).join("")}
        </div>
      ` : `<p class="text-gray-400 text-sm">You have not placed any bids yet.</p>`}
    </div>
  `;

  const editBtn = document.getElementById("edit-btn");
  const editError = document.getElementById("edit-error");
  const editSuccess = document.getElementById("edit-success");

  editBtn.addEventListener("click", async () => {
    const bio = document.getElementById("edit-bio").value.trim();
    const avatarUrl = document.getElementById("edit-avatar").value.trim();
    const bannerUrl = document.getElementById("edit-banner").value.trim();

    editError.classList.add("hidden");
    editSuccess.classList.add("hidden");

    const body = { bio };
    if (avatarUrl) body.avatar = { url: avatarUrl, alt: "avatar" };
    if (bannerUrl) body.banner = { url: bannerUrl, alt: "banner" };

    editBtn.textContent = "Saving...";
    editBtn.disabled = true;

    try {
      const updated = await updateProfile(profile.name, body);
      localStorage.setItem("profile", JSON.stringify(updated.data));
      editSuccess.textContent = "Profile updated! Reloading...";
      editSuccess.classList.remove("hidden");
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      editError.textContent = err.message;
      editError.classList.remove("hidden");
      editBtn.textContent = "Save changes";
      editBtn.disabled = false;
    }
  });
}

async function init() {
  const profile = getProfile();

  if (!profile) {
    container.innerHTML = `
      <div class="text-center py-16">
        <p class="text-gray-500 mb-4">You need to be logged in to view your profile.</p>
        <a href="/login.html" class="bg-[#0063FB] text-white px-6 py-2.5 rounded-lg font-bold hover:bg-blue-700 transition text-sm">Log in</a>
      </div>`;
    return;
  }

  try {
    const [profileData, listings, bids] = await Promise.all([
      getProfileData(profile.name),
      getProfileListings(profile.name),
      getProfileBids(profile.name),
    ]);
    renderProfile(profileData, listings, bids);
  } catch (err) {
    container.innerHTML = `<p class="text-red-400">Failed to load profile: ${err.message}</p>`;
  }
}

init();
