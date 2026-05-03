import { API_BASE, fetchData } from "/js/api.js";

const btn = document.getElementById("create-btn");
const errorMsg = document.getElementById("error-msg");
const successMsg = document.getElementById("success-msg");

// Redirect to login if not logged in
if (!localStorage.getItem("token")) {
  window.location.href = "/login.html";
}

btn.addEventListener("click", async () => {
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const mediaUrl = document.getElementById("media").value.trim();
  const deadline = document.getElementById("deadline").value;

  errorMsg.classList.add("hidden");
  successMsg.classList.add("hidden");

  if (!title || !deadline) {
    errorMsg.textContent = "Title and deadline are required.";
    errorMsg.classList.remove("hidden");
    return;
  }

  const body = {
    title,
    description,
    endsAt: new Date(deadline).toISOString(),
  };

  if (mediaUrl) {
    body.media = [{ url: mediaUrl, alt: title }];
  }

  btn.textContent = "Creating...";
  btn.disabled = true;

  try {
    const result = await fetchData(`${API_BASE}/auction/listings`, {
      method: "POST",
      body: JSON.stringify(body),
    });
    successMsg.textContent = "Listing created! Redirecting...";
    successMsg.classList.remove("hidden");
    setTimeout(() => {
      window.location.href = `/listing.html?id=${result.data.id}`;
    }, 1500);
  } catch (err) {
    errorMsg.textContent = err.message;
    errorMsg.classList.remove("hidden");
    btn.textContent = "Create listing";
    btn.disabled = false;
  }
});