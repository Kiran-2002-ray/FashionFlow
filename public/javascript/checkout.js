document.addEventListener('DOMContentLoaded', function () {
    const stripe = Stripe('pk_test_51PstGdCDlL9dYdMvr11liMW1BZlg7n8dW0x8MhimgdV4YxEnufo1VaGqKHTRyfNrQrQdpzHtuUhFiDK76loyiUAe00pdGNHuEE'); // Replace with your Stripe publishable key
    const elements = stripe.elements();
    const cardElement = elements.create('card');
    cardElement.mount('#card-element');

    const checkoutForm = document.getElementById('checkout-form');

    checkoutForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token'); 
        // Assume user is logged in and token is stored

        const shipping_address = {
            street: document.getElementById('street').value,
            city: document.getElementById('city').value,
            state: document.getElementById('state').value,
            zip: document.getElementById('zip').value,
            country: document.getElementById('country').value,
        };

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
        });

        if (error) {
            document.getElementById('card-errors').textContent = error.message;
        } else {
            try {
                const response = await axios.post('/api/orders/create', {
                    payment_method_id: paymentMethod.id,
                    shipping_address: shipping_address
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.data.success) {
                    window.location.href = '/order_success.html';
                } else {
                    alert('Payment failed. Please try again.');
                }
            } catch (err) {
                console.error(err);
                alert('An error occurred while processing your order.');
            }
        }
    });
});
