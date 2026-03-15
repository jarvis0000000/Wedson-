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

// Initialize
document.addEventListener('DOMContentLoaded', function() {
  initNavigation();
  initCart();
  initRoomBooking();
  initBanquetBooking();
  initSmoothScroll();
  initScrollEffects();
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
  // Navbar scroll effect
  window.addEventListener('scroll', function() {
    if (window.scrollY > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Initial check
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

  // Close on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && cartModal.classList.contains('active')) {
      closeCartModal();
    }
  });

  // Order on WhatsApp
  orderWhatsApp.addEventListener('click', function() {
    sendOrderToWhatsApp();
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
    cartItems.innerHTML = '\n      <div class="cart-empty">\n        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">\n          <circle cx="9" cy="21" r="1"></circle>\n          <circle cx="20" cy="21" r="1"></circle>\n          <path d="m1 1 4 4h14l-3 9H7L1 1z"></path>\n        </svg>\n        <p>Your cart is empty</p>\n      </div>\n    ';
    cartTotal.textContent = CONFIG.currency + '0';
    return;
  }

  var html = '';
  cart.forEach(function(item) {
    html += '\n      <div class="cart-item">\n        <div class="cart-item-info">\n          <h4>' + item.name + '</h4>\n          <span>' + CONFIG.currency + item.price + ' each</span>\n        </div>\n        <div class="cart-item-actions">\n          <div class="cart-item-qty">\n            <button onclick="updateQuantity(\'' + item.name + '\', -1)">-</button>\n            <span>' + item.quantity + '</span>\n            <button onclick="updateQuantity(\'' + item.name + '\', 1)">+</button>\n          </div>\n          <button class="remove-item" onclick="removeFromCart(\'' + item.name + '\')">\n            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">\n              <path d="M3 6h18"></path>\n              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>\n              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>\n            </svg>\n          </button>\n        </div>\n      </div>\n    ';
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

// Make functions globally available for onclick handlers
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
