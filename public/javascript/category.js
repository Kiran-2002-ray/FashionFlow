document.addEventListener("DOMContentLoaded", () => {
    const categoryName = new URLSearchParams(window.location.search).get('category');
    document.getElementById('category-name').textContent = categoryName;

    axios.get(`/api/category/getcategory/${categoryName}`)
        .then(response => {
            const products = response.data;
            console.log("result", products);

            const productContainer = document.getElementById('product-list');
            productContainer.innerHTML = ''; // Clear existing content
            products.forEach(product => {
                const productCard = `
                    <div class="col-md-4 mb-4">
                        <div class="card">
                            <img src="${product.image_urls[0]}" class="card-img-top" alt="${product.name}">
                            <div class="card-body">
                                <h5 class="card-title">${product.name}</h5>
                                <p class="card-text">Rs. ${product.price}</p>
                                <a href="product_detail.html?id=${product._id}" class="btn bright-yellow">View Details</a>
                            </div>
                        </div>
                    </div>
                `;
                productContainer.innerHTML += productCard;
            });
        })
        .catch(error => console.error('Error fetching products:', error));
});
