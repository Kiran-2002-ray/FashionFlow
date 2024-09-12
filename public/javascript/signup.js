document
  .getElementById("signupForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const recaptchaResponse = grecaptcha.getResponse(); // Get reCAPTCHA response

    if (!recaptchaResponse) {
      alert("Please complete the CAPTCHA");
      return;
    }

    try {
      let response = await axios.post("/api/auth/signup", {
        username,
        email,
        password,
        recaptchaResponse
      });

      if (response.data.redirectUrl) {
        window.location.href = response.data.redirectUrl;
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });
