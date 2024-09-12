document.addEventListener("DOMContentLoaded", function () {
  // Select the contact form element
  const contactForm = document.getElementById("contactForm");

  // Add an event listener for form submission
  contactForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    // Collect form data
    const formData = {
      name: document.getElementById("name").value.trim(),
      email: document.getElementById("email").value.trim(),
      subject: document.getElementById("subject").value.trim(),
      message: document.getElementById("message").value.trim(),
    };

    // Validate the form data (basic example)
    if (
      !formData.name ||
      !formData.email ||
      !formData.subject ||
      !formData.message
    ) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      // Send the form data to the backend using Axios with async/await
      const response = await axios.post("/api/contact/sendContact", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert(response.data.message || "Your message has been sent successfully.");
      contactForm.reset(); // Reset the form fields
    } catch (error) {
      // Handle an error response
      console.error("There was an error sending your message:", error);
      alert(
        "There was an error sending your message. Please try again later."
      );
    }
  });
});
