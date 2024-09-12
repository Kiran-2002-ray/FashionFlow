document.addEventListener("DOMContentLoaded", () => {
    const productId = new URLSearchParams(window.location.search).get('id');

    axios.get(`/api/category/productDetails/${productId}`)
        .then(response => {
            const product = response.data;
            document.getElementById('product-name').textContent = product.name;
            document.getElementById('product-price').textContent = `Rs. ${product.price.toFixed(2)}`;
            document.getElementById('product-description').textContent = product.description;
            document.getElementById('product-image').src = product.image_urls[0];
        })
        .catch(error => console.error('Error fetching product:', error));

    document.getElementById('add-to-cart-btn').addEventListener('click', () => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Please login to add product to cart");
            return;
        }

        const quantity = parseInt(document.getElementById('quantity').value, 10);

        axios.post('/api/cart/add', {
            product_id: productId,
            quantity: quantity
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                alert('Item added to cart!');
            })
            .catch(error => {
                console.error('Error adding to cart:', error);
            });
    });
});
