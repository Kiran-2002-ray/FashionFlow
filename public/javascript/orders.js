const token = localStorage.getItem('token');

async function fetchOrders() {
    try {
        const response = await axios.get('/api/orders/getOrders', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.data.length === 0) {
            document.getElementById('orders-container').innerHTML = '<p>No orders found.</p>';
            return;
        }

        let table = `
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Total Price</th>
                        <th>Status</th>
                        <th>Shipping Address</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
        `;

        response.data.forEach(order => {
            table += `
                <tr>
                    <td>${order._id}</td>
                    <td>$${order.total_price.toFixed(2)}</td>
                    <td>${order.status}</td>
                    <td>${order.shipping_address.street}, ${order.shipping_address.city}, ${order.shipping_address.state}, ${order.shipping_address.zip}, ${order.shipping_address.country}</td>
                    <td>${new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
            `;
        });

        table += '</tbody></table>';
        document.getElementById('orders-container').innerHTML = table;
    } catch (error) {
        console.error('Error fetching orders:', error);
        document.getElementById('orders-container').innerHTML = '<p>There was an error fetching your orders. Please try again later.</p>';
    }
}

fetchOrders();
