// ===================== BILL GENERATOR FUNCTIONS =====================

// Open Bill Modal
function openBillModal() {
    const cartModal = document.getElementById('cartModal');
    if (cartModal) cartModal.style.display = 'none';

    const billModal = document.getElementById('billModal');
    billModal.style.display = 'flex';

    updateBillPreview();
}

// Close Bill Modal
function closeBillModal() {
    document.getElementById('billModal').style.display = 'none';
}

// Update Bill Preview
function updateBillPreview() {
    const container = document.getElementById('bill-preview-items');
    container.innerHTML = '';

    if (!window.cart || window.cart.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:#888;padding:20px;">Cart is empty</p>';
        document.getElementById('bill-total').textContent = '0';
        return;
    }

    let total = 0;

    window.cart.forEach(item => {
        const subtotal = item.price * (item.qty || 1);
        total += subtotal;

        const div = document.createElement('div');
        div.style.cssText = 'display:flex;justify-content:space-between;margin:8px 0;padding:8px 0;border-bottom:1px solid #333;';
        div.innerHTML = `
            <span>${item.name} × ${item.qty || 1}</span>
            <span>₹${subtotal}</span>
        `;
        container.appendChild(div);
    });

    document.getElementById('bill-total').textContent = total;
}

// Send Bill on WhatsApp
function sendBillViaWhatsApp() {
    const name = document.getElementById('customer-name').value.trim();
    const phone = document.getElementById('customer-phone').value.trim();
    const address = document.getElementById('customer-address').value.trim();

    if (!name || !phone || !address || phone.length !== 10) {
        alert("Please fill Customer Name, 10-digit Phone & Address");
        return;
    }

    if (!window.cart || window.cart.length === 0) {
        alert("Cart is empty!");
        return;
    }

    let total = window.cart.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0);

    let message = `Wedson Hotel & Resort Bill\n\n`;
    message += `Customer: ${name}\n`;
    message += `Phone: ${phone}\n`;
    message += `Address: ${address}\n\n`;
    message += `Ordered Items:\n`;

    window.cart.forEach(item => {
        message += `- ${item.name} × ${item.qty || 1} = ₹${item.price * (item.qty || 1)}\n`;
    });

    message += `\nTotal: ₹${total}\n\n`;
    message += `Thank you for visiting Wedson Hotel & Resort!\n`;
    message += `Website: ${window.location.href}`;

    const whatsappURL = `https://wa.me/91${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');

    closeBillModal();
}

// Close modals when clicking overlay
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', function() {
        this.parentElement.style.display = 'none';
    });
});
