document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token"); // Get the token from localStorage

    if (!token) {
        console.error('No authentication token found.');
        return;
    }

    try {
        // Fetch cart items with authentication token
        const response = await axios.get(`/api/cart/getCartData`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const cart = response.data.cart;
        console.log(cart);
        const cartItemsContainer = document.getElementById('cart-items');

        // Clear existing cart items
        cartItemsContainer.innerHTML = '';

        cart.items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('row', 'mb-3');

            // Extract the actual product ID
            const productId = item.product_id;

            itemElement.innerHTML = `
                <div class="col-md-4">${item.name}</div>
                <div class="col-md-2">Rs. ${item.unit_price}</div>
                <div class="col-md-2">
                    <input type="number" value="${item.quantity}" min="1" class="form-control update-quantity" data-product-id="${productId}">
                </div>
                <div class="col-md-2">Rs. ${item.unit_price * item.quantity}</div>
                <div class="col-md-2">
                    <button class="btn btn-danger remove-item-btn" data-product-id="${productId}">Remove</button>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
        });

        document.getElementById('cart-total').textContent = `Total: Rs. ${cart.total_price}`;

    } catch (error) {
        console.error('Error fetching cart:', error);
    }

    // Update item quantity
    document.getElementById('cart-items').addEventListener('change', async (e) => {
        if (e.target.classList.contains('update-quantity')) {
            const product_id = e.target.getAttribute('data-product-id');
            const quantity = parseInt(e.target.value, 10);

            try {
                await axios.put('/api/cart/update', {
                    product_id: product_id,
                    quantity: quantity
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert('Cart updated!');
                location.reload(); // Reload page to update cart
            } catch (error) {
                console.error('Error updating cart:', error);
            }
        }
    });

    // Remove item from cart
    document.getElementById('cart-items').addEventListener('click', async (e) => {
        if (e.target.classList.contains('remove-item-btn')) {
            const product_id = e.target.getAttribute('data-product-id');

            try {
                await axios.delete(`/api/cart/remove/${product_id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                alert('Item removed from cart!');
                location.reload(); // Reload page to update cart
            } catch (error) {
                console.error('Error removing item from cart:', error);
            }
        }
    });
});
