import { login } from "/js/auth.js";

const btn = document.getElementById("login-btn");
const errorMsg = document.getElementById("error-msg");

btn.addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  errorMsg.classList.add("hidden");

  if (!email || !password) {
    errorMsg.textContent = "Please fill in all fields.";
    errorMsg.classList.remove("hidden");
    return;
  }

  btn.textContent = "Logging in...";
  btn.disabled = true;

  try {
    await login(email, password);
    window.location.href = "/index.html";
  } catch (err) {
    errorMsg.textContent = err.message;
    errorMsg.classList.remove("hidden");
    btn.textContent = "Log in";
    btn.disabled = false;
  }
});
