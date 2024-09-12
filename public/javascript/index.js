document.addEventListener("DOMContentLoaded", async () => {
    try {
      const response = await axios.get('/api/products/getProducts');
      const products = response.data;
      console.log(products);
  
      const productContainer = document.querySelector('.featured-products .row');
  
      // Clear existing content
      productContainer.innerHTML = '';
  
      products.forEach(product => {
        const productCard = `
          <div class="col-md-4 mb-4">
            <div class="card">
              <img src="${product.image_urls}" class="card-img-top" alt="${product.name}" />
              <div class="card-body">
                <h5 class="card-title">${product.name}</h5>
                <p class="card-text">Rs. ${product.price}</p>
                <a href="/product_detail.html?id=${product._id}" class="btn btn-warning">Buy Now</a>
              </div>
            </div>
          </div>
        `;
        productContainer.insertAdjacentHTML('beforeend', productCard);
      });
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  });
  
  document.getElementById('searchButton').addEventListener('click', async () => {
    const searchTerm = document.getElementById('searchInput').value;
  
    if (!searchTerm) {
      alert('Please enter a search term');
      return;
    }
  
    try {
      const response = await axios.get(`/api/products/search?q=${encodeURIComponent(searchTerm)}`);
      const products = response.data;
  
      // Display search results
      const resultsContainer = document.getElementById('searchResults');
      resultsContainer.innerHTML = '';
  
      if (products.length === 0) {
        resultsContainer.innerHTML = '<p>No products found</p>';
      } else {
        products.forEach(product => {
          const productDiv = document.createElement('div');
          productDiv.classList.add('product-card');
          productDiv.innerHTML = `
            <div class="card mb-4" style="width: 18rem;">
              <img src="${product.image_urls[0]}" class="card-img-top" alt="${product.name}">
              <div class="card-body">
                <h5 class="card-title">${product.name}</h5>
                <p class="card-text">${product.description}</p>
                <p class="card-text">Price: Rs. ${product.price}</p>
                <a href="/product_detail.html?id=${product._id}" class="btn btn-warning">Buy Now</a>
              </div>
            </div>
          `;
          resultsContainer.appendChild(productDiv);
        });
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
      alert('Error fetching search results');
    }
  });
  