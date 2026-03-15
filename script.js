/**
 * Wedson Hotel & Resort - Interactive Features
 * =============================================
 */

// Configuration
const CONFIG = {
  whatsappNumber: '919876543210',
  currency: '\u20B9', // Rupee symbol
};

// State
let cart = [];

// DOM Elements
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const cartBtn = document.getElementById('cartBtn');
const cartCount = document.getElementById('cartCount');
const cartModal = document.getElementById('cartModal');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const orderWhatsApp = document.getElementById('orderWhatsApp');
const bookBanquet = document.getElementById('bookBanquet');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');

// NEW: Bill Modal Elements
const billModal = document.getElementById('billModal');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
  initNavigation();
  initCart();
  initRoomBooking();
  initBanquetBooking();
  initSmoothScroll();
  initScrollEffects();
  initBillModal();          // ← New
});

/**
 * Navigation
 */
function initNavigation() {
  // Mobile menu toggle
  navToggle.addEventListener('click', function() {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
  });

  // Close menu on link click
  document.querySelectorAll('.nav-link').forEach(function(link) {
    link.addEventListener('click', function() {
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Close menu on outside click
  document.addEventListener('click', function(e) {
    if (!navMenu.contains(e.target) && !navToggle.contains(e.target) && navMenu.classList.contains('active')) {
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

/**
 * Scroll Effects
 */
function initScrollEffects() {
  window.addEventListener('scroll', function() {
    if (window.scrollY > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  if (window.scrollY > 100) {
    navbar.classList.add('scrolled');
  }
}

/**
 * Smooth Scroll
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * Cart Functions
 */
function initCart() {
  // Add to cart buttons
  document.querySelectorAll('.add-to-cart').forEach(function(button) {
    button.addEventListener('click', function() {
      const card = this.closest('.menu-card');
      const name = card.dataset.name;
      const price = parseInt(card.dataset.price);
      addToCart(name, price);
    });
  });

  // Open cart modal
  cartBtn.addEventListener('click', function() {
    openCartModal();
  });

  // Close cart modal
  closeCart.addEventListener('click', function() {
    closeCartModal();
  });

  // Close on overlay click
  cartModal.querySelector('.modal-overlay').addEventListener('click', function() {
    closeCartModal();
  });

  // Order on WhatsApp
  orderWhatsApp.addEventListener('click', function() {
    sendOrderToWhatsApp();
  });

  // ESC Key (now handles both cart & bill)
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      if (cartModal.classList.contains('active')) closeCartModal();
      if (billModal && billModal.classList.contains('active')) closeBillModal();
    }
  });
}

function addToCart(name, price) {
  const existingItem = cart.find(function(item) {
    return item.name === name;
  });

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ name: name, price: price, quantity: 1 });
  }

  updateCartUI();
  showToast(name + ' added to cart');
}

function removeFromCart(name) {
  cart = cart.filter(function(item) {
    return item.name !== name;
  });
  updateCartUI();
  renderCartItems();
}

function updateQuantity(name, change) {
  const item = cart.find(function(item) {
    return item.name === name;
  });

  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      removeFromCart(name);
    } else {
      updateCartUI();
      renderCartItems();
    }
  }
}

function updateCartUI() {
  const totalItems = cart.reduce(function(sum, item) {
    return sum + item.quantity;
  }, 0);
  cartCount.textContent = totalItems;
}

function getCartTotal() {
  return cart.reduce(function(sum, item) {
    return sum + (item.price * item.quantity);
  }, 0);
}

function renderCartItems() {
  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="cart-empty">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="m1 1 4 4h14l-3 9H7L1 1z"></path>
        </svg>
        <p>Your cart is empty</p>
      </div>`;
    cartTotal.textContent = CONFIG.currency + '0';
    return;
  }

  var html = '';
  cart.forEach(function(item) {
    html += `
      <div class="cart-item">
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <span>${CONFIG.currency}${item.price} each</span>
        </div>
        <div class="cart-item-actions">
          <div class="cart-item-qty">
            <button onclick="updateQuantity('${item.name}', -1)">-</button>
            <span>${item.quantity}</span>
            <button onclick="updateQuantity('${item.name}', 1)">+</button>
          </div>
          <button class="remove-item" onclick="removeFromCart('${item.name}')">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 6h18"></path>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </div>`;
  });
  cartItems.innerHTML = html;
  cartTotal.textContent = CONFIG.currency + getCartTotal();
}

function openCartModal() {
  renderCartItems();
  cartModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCartModal() {
  cartModal.classList.remove('active');
  document.body.style.overflow = '';
}

function sendOrderToWhatsApp() {
  if (cart.length === 0) {
    showToast('Your cart is empty');
    return;
  }

  var message = 'Hello! I would like to place an order:\n\n';

  cart.forEach(function(item) {
    message += '- ' + item.name + ' x ' + item.quantity + ' = ' + CONFIG.currency + (item.price * item.quantity) + '\n';
  });

  message += '\nTotal: ' + CONFIG.currency + getCartTotal();
  message += '\n\nPlease confirm my order. Thank you!';

  var whatsappUrl = 'https://wa.me/' + CONFIG.whatsappNumber + '?text=' + encodeURIComponent(message);
  window.open(whatsappUrl, '_blank');
}

/**
 * ===================== BILL GENERATOR (OWNER PANEL) =====================
 */
function initBillModal() {
  if (!billModal) return;

  const billOverlay = billModal.querySelector('.modal-overlay');
  if (billOverlay) {
    billOverlay.addEventListener('click', closeBillModal);
  }
}

function openBillModal() {
  if (cart.length === 0) {
    showToast('Your cart is empty!');
    return;
  }

  closeCartModal();               // close cart first
  billModal.classList.add('active');
  document.body.style.overflow = 'hidden';
  updateBillPreview();
}

function closeBillModal() {
  billModal.classList.remove('active');
  document.body.style.overflow = '';
}

function updateBillPreview() {
  const container = document.getElementById('bill-preview-items');
  container.innerHTML = '';

  let total = 0;

  cart.forEach(function(item) {
    const subtotal = item.price * item.quantity;
    total += subtotal;

    const div = document.createElement('div');
    div.style.cssText = 'display:flex; justify-content:space-between; margin:10px 0; padding:10px 0; border-bottom:1px solid #333;';
    div.innerHTML = `
      <span>${item.name} × ${item.quantity}</span>
      <span>${CONFIG.currency}${subtotal}</span>
    `;
    container.appendChild(div);
  });

  document.getElementById('bill-total').textContent = CONFIG.currency + total;
}

function sendBillViaWhatsApp() {
  const name = document.getElementById('customer-name').value.trim();
  const phone = document.getElementById('customer-phone').value.trim();
  const address = document.getElementById('customer-address').value.trim();

  if (!name || !phone || phone.length !== 10 || !address) {
    showToast('Please enter Name, 10-digit Phone & Address');
    return;
  }

  let total = getCartTotal();

  let message = `Wedson Hotel & Resort Bill\n\n`;
  message += `Customer: ${name}\n`;
  message += `Phone: ${phone}\n`;
  message += `Address: ${address}\n\n`;
  message += `Ordered Items:\n`;

  cart.forEach(function(item) {
    message += `- ${item.name} × ${item.quantity} = ${CONFIG.currency}${(item.price * item.quantity)}\n`;
  });

  message += `\nTotal: ${CONFIG.currency}${total}\n\n`;
  message += `Thank you for visiting Wedson Hotel & Resort!\n`;
  message += `Website: ${window.location.href}`;

  const whatsappUrl = `https://wa.me/91${phone}?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');

  closeBillModal();
}

/**
 * Room Booking
 */
function initRoomBooking() {
  document.querySelectorAll('.book-room').forEach(function(button) {
    button.addEventListener('click', function() {
      var roomName = this.dataset.room;
      bookRoom(roomName);
    });
  });
}

function bookRoom(roomName) {
  var message = 'Hello! I am interested in booking the ' + roomName + ' at Wedson Hotel & Resort.\n\n';
  message += 'Please provide availability and pricing details.\n\n';
  message += 'Thank you!';

  var whatsappUrl = 'https://wa.me/' + CONFIG.whatsappNumber + '?text=' + encodeURIComponent(message);
  window.open(whatsappUrl, '_blank');
}

/**
 * Banquet Booking
 */
function initBanquetBooking() {
  bookBanquet.addEventListener('click', function() {
    var message = 'Hello! I am interested in booking the Banquet Hall at Wedson Hotel & Resort.\n\n';
    message += 'Event Type: [Please specify: Wedding/Birthday/Corporate/Other]\n';
    message += 'Expected Guests: [Number]\n';
    message += 'Preferred Date: [Date]\n\n';
    message += 'Please provide availability and pricing details.\n\n';
    message += 'Thank you!';

    var whatsappUrl = 'https://wa.me/' + CONFIG.whatsappNumber + '?text=' + encodeURIComponent(message);
    window.open(whatsappUrl, '_blank');
  });
}

/**
 * Toast Notification
 */
function showToast(message) {
  toastMessage.textContent = message;
  toast.classList.add('active');

  setTimeout(function() {
    toast.classList.remove('active');
  }, 3000);
}

// Make functions globally available
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
window.openBillModal = openBillModal;
window.closeBillModal = closeBillModal;
window.sendBillViaWhatsApp = sendBillViaWhatsApp;
