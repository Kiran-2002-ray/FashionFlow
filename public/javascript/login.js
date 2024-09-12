document.addEventListener("DOMContentLoaded", function () {
  // Show Forgot Password Form
  document
    .querySelector(".forgot-password")
    .addEventListener("click", function (event) {
      event.preventDefault();
      document.getElementById("loginFormContainer").style.display = "none";
      document.getElementById("forgotPasswordContainer").style.display =
        "block";
    });

  // Back to Login from Forgot Password Form
  document
    .getElementById("backToLogin")
    .addEventListener("click", function (event) {
      event.preventDefault();
      document.getElementById("forgotPasswordContainer").style.display = "none";
      document.getElementById("loginFormContainer").style.display = "block";
    });

  // Back to Login from Reset Password Form
  document
    .getElementById("backToLoginFromReset")
    .addEventListener("click", function (event) {
      event.preventDefault();
      document.getElementById("resetPasswordContainer").style.display = "none";
      document.getElementById("loginFormContainer").style.display = "block";
    });

  // Handle Forgot Password Form Submission
  document
    .getElementById("forgotPasswordForm")
    .addEventListener("submit", async function (event) {
      event.preventDefault();
      const email = document.getElementById("forgotEmail").value;

      try {
        const response = await axios.post("/api/auth/forgotPassword", {
          email,
        });
        alert(response.data.message);
        if (response.status === 200) {
          document.getElementById("forgotPasswordContainer").style.display =
            "none";
          document.getElementById("resetPasswordContainer").style.display =
            "block";
        }
      } catch (error) {
        console.error(error);
        alert("Error occurred while sending verification code.");
      }
    });

  // Handle Reset Password Form Submission
  document
    .getElementById("resetPasswordForm")
    .addEventListener("submit", async function (event) {
      event.preventDefault();
      const email = document.getElementById("resetEmail").value;
      const code = document.getElementById("verificationCode").value;
      const newPassword = document.getElementById("newPassword").value;

      try {
        const response = await axios.post("/api/auth/resetPassword", {
          email,
          code,
          newPassword,
        });
        alert(response.data.message);
        if (response.status === 200) {
          document.getElementById("resetPasswordContainer").style.display =
            "none";
          document.getElementById("loginFormContainer").style.display = "block";
        }
      } catch (error) {
        console.error(error);
        alert("Error occurred while resetting password.");
      }
    });

  // Handle Login Form Submission
  document
    .getElementById("loginForm")
    .addEventListener("submit", async function (event) {
      event.preventDefault(); // Prevent the default form submission

      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      try {
        const response = await axios.post("/api/auth/login", {
          username,
          password,
        });
        console.log("Response:", response.data);
        if (
          response.status === 200 &&
          response.data.token &&
          response.data.user
        ) {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.user));
          localStorage.setItem("role", JSON.stringify(response.data.user.role));

          if (response.data.redirectUrl) {
            window.location.href = response.data.redirectUrl;
          }
        } else {
          alert(response.data.message);
        }
      } catch (error) {
        console.error(
          "Error:",
          error.response ? error.response.data : error.message
        );
        alert("Login failed. Please check your credentials and try again.");
      }
    });
});
