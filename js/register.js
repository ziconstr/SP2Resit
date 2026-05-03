import { register } from "/js/auth.js";

const btn = document.getElementById("register-btn");
const errorMsg = document.getElementById("error-msg");
const successMsg = document.getElementById("success-msg");

btn.addEventListener("click", async () => {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  errorMsg.classList.add("hidden");
  successMsg.classList.add("hidden");

  if (!name || !email || !password) {
    errorMsg.textContent = "Please fill in all fields.";
    errorMsg.classList.remove("hidden");
    return;
  }

  if (!email.endsWith("@stud.noroff.no")) {
    errorMsg.textContent = "Email must end in @stud.noroff.no";
    errorMsg.classList.remove("hidden");
    return;
  }

  if (password.length < 8) {
    errorMsg.textContent = "Password must be at least 8 characters.";
    errorMsg.classList.remove("hidden");
    return;
  }

  btn.textContent = "Creating account...";
  btn.disabled = true;

  try {
    await register(name, email, password);
    successMsg.textContent = "Account created! Redirecting to login...";
    successMsg.classList.remove("hidden");
    setTimeout(() => {
      window.location.href = "/login.html";
    }, 1500);
  } catch (err) {
    errorMsg.textContent = err.message;
    errorMsg.classList.remove("hidden");
    btn.textContent = "Create account";
    btn.disabled = false;
  }
});