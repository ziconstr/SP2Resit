import { logout } from "/js/auth.js";

function getToken() {
  return localStorage.getItem("token");
}

function getProfile() {
  const profile = localStorage.getItem("profile");
  return profile ? JSON.parse(profile) : null;
}

function createNavbar() {
  const isLoggedIn = getToken();
  const profile = getProfile();

  const nav = document.createElement("div");
  nav.innerHTML = `
    <header class="bg-[#0063FB] shadow-md">
      <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

        <a href="/index.html" class="text-white text-2xl font-extrabold tracking-tight">
          Auction<span class="text-yellow-300">House</span>
        </a>

        <!-- Desktop nav -->
        <nav class="hidden md:flex items-center gap-6 text-sm font-medium">
          <a href="/index.html" class="text-white hover:text-yellow-300 transition">Browse</a>
          ${isLoggedIn ? `
            <a href="/listing.html" class="text-white hover:text-yellow-300 transition">New Listing</a>
            <a href="/profile.html" class="text-white hover:text-yellow-300 transition">Profile</a>
            <span class="text-blue-200 text-xs">Credits: <strong class="text-white">${profile?.credits ?? 0}</strong></span>
            <button id="logout-btn" class="bg-white text-[#0063FB] font-semibold px-4 py-1.5 rounded-full hover:bg-yellow-300 hover:text-black transition">Logout</button>
          ` : `
            <a href="/login.html" class="text-white hover:text-yellow-300 transition">Login</a>
            <a href="/register.html" class="bg-white text-[#0063FB] font-semibold px-4 py-1.5 rounded-full hover:bg-yellow-300 hover:text-black transition">Register</a>
          `}
        </nav>

        <!-- Hamburger -->
        <button id="hamburger-btn" class="md:hidden text-white focus:outline-none">
          <svg id="icon-open" xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
          <svg id="icon-close" xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>

      </div>

      <!-- Mobile menu -->
      <div id="mobile-menu" class="hidden md:hidden bg-[#0052cc] px-4 pb-4 flex flex-col gap-3 text-sm font-medium">
        <a href="/index.html" class="text-white hover:text-yellow-300 transition pt-2">Browse</a>
        ${isLoggedIn ? `
          <a href="/listing.html" class="text-white hover:text-yellow-300 transition">New Listing</a>
          <a href="/profile.html" class="text-white hover:text-yellow-300 transition">Profile</a>
          <span class="text-blue-200 text-xs">Credits: <strong class="text-white">${profile?.credits ?? 0}</strong></span>
          <button id="logout-btn-mobile" class="bg-white text-[#0063FB] font-semibold px-4 py-2 rounded-full hover:bg-yellow-300 hover:text-black transition w-full">Logout</button>
        ` : `
          <a href="/login.html" class="text-white hover:text-yellow-300 transition">Login</a>
          <a href="/register.html" class="bg-white text-[#0063FB] font-semibold px-4 py-2 rounded-full hover:bg-yellow-300 hover:text-black transition text-center">Register</a>
        `}
      </div>
    </header>
  `;

  document.body.prepend(nav);

  // Hamburger toggle
  const btn = document.getElementById("hamburger-btn");
  const menu = document.getElementById("mobile-menu");
  const iconOpen = document.getElementById("icon-open");
  const iconClose = document.getElementById("icon-close");

  btn.addEventListener("click", () => {
    menu.classList.toggle("hidden");
    iconOpen.classList.toggle("hidden");
    iconClose.classList.toggle("hidden");
  });

  // Logout buttons
  const logoutBtn = document.getElementById("logout-btn");
  const logoutBtnMobile = document.getElementById("logout-btn-mobile");

  if (logoutBtn) logoutBtn.addEventListener("click", logout);
  if (logoutBtnMobile) logoutBtnMobile.addEventListener("click", logout);
}

createNavbar();