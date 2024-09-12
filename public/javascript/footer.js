
  function loadFooter() {
    fetch('footer.html')
      .then(response => response.text())
      .then(data => {
        document.getElementById('footer-container').innerHTML = data;
      });
  }

  // Call the function to load the footer when the page is loaded
  window.onload = loadFooter;
