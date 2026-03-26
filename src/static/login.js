document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const messageDiv = document.getElementById("message");

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    // Simple validation (no real auth yet)
    if (!username || !password || !role) {
      messageDiv.textContent = "Please fill in all fields.";
      messageDiv.className = "error";
      messageDiv.classList.remove("hidden");
      return;
    }

    // Redirect based on role
    if (role === "admin") {
      window.location.href = "admin.html";
    } else if (role === "user") {
      window.location.href = "user.html";
    } else {
      messageDiv.textContent = "Invalid role selected.";
      messageDiv.className = "error";
      messageDiv.classList.remove("hidden");
    }
  });
});