// script.js
// ==================== DATA ====================
const restaurants = [
    {
        id: 1,
        name: "Spice Palace",
        cuisine: "North Indian",
        rating: 4.8,
        img: "https://picsum.photos/id/1015/300/200",
        cover: "https://picsum.photos/id/1015/1200/400",
        whatsapp: "919876543210",
        about: "Authentic North Indian flavours since 2012. Famous for butter chicken and fresh naan.",
        gallery: [
            "https://picsum.photos/id/1016/400/300",
            "https://picsum.photos/id/1018/400/300",
            "https://picsum.photos/id/102/400/300"
        ],
        menu: [
            {
                category: "Starters",
                items: [
                    { id: 101, name: "Paneer Tikka", price: 240, img: "https://picsum.photos/id/201/140/140", desc: "Marinated cottage cheese" },
                    { id: 102, name: "Chicken Seekh Kebab", price: 280, img: "https://picsum.photos/id/30/140/140", desc: "Minced chicken skewers" }
                ]
            },
            {
                category: "Mains",
                items: [
                    { id: 103, name: "Butter Chicken", price: 320, img: "https://picsum.photos/id/251/140/140", desc: "Creamy tomato gravy" },
                    { id: 104, name: "Dal Makhani", price: 180, img: "https://picsum.photos/id/29/140/140", desc: "Black lentils slow cooked" }
                ]
            }
        ]
    },
    {
        id: 2,
        name: "Pizza Haven",
        cuisine: "Italian & Fast Food",
        rating: 4.6,
        img: "https://picsum.photos/id/201/300/200",
        cover: "https://picsum.photos/id/201/1200/400",
        whatsapp: "919876543210",
        about: "Fresh wood-fired pizzas and pasta made with love in Anand.",
        gallery: [
            "https://picsum.photos/id/251/400/300",
            "https://picsum.photos/id/29/400/300",
            "https://picsum.photos/id/30/400/300"
        ],
        menu: [
            {
                category: "Pizzas",
                items: [
                    { id: 201, name: "Margherita", price: 220, img: "https://picsum.photos/id/201/140/140", desc: "Classic cheese" },
                    { id: 202, name: "Pepperoni Feast", price: 340, img: "https://picsum.photos/id/30/140/140", desc: "Spicy pepperoni" }
                ]
            }
        ]
    },
    {
        id: 3,
        name: "Wok & Roll",
        cuisine: "Chinese",
        rating: 4.4,
        img: "https://picsum.photos/id/251/300/200",
        cover: "https://picsum.photos/id/251/1200/400",
        whatsapp: "919876543210",
        about: "Indo-Chinese fusion with the freshest ingredients.",
        gallery: [
            "https://picsum.photos/id/1015/400/300",
            "https://picsum.photos/id/102/400/300",
            "https://picsum.photos/id/201/400/300"
        ],
        menu: [
            {
                category: "Starters",
                items: [
                    { id: 301, name: "Veg Spring Rolls", price: 160, img: "https://picsum.photos/id/29/140/140", desc: "Crispy rolls" }
                ]
            }
        ]
    }
];

const roomsData = [
    { id: 1, name: "Deluxe AC Room", price: 1499, img: "https://picsum.photos/id/160/300/200", desc: "King bed, balcony view" },
    { id: 2, name: "Standard Room", price: 899, img: "https://picsum.photos/id/201/300/200", desc: "Double bed, attached bath" }
];

const banquetData = [
    { id: 1, name: "Grand Hall (150 pax)", price: "₹25,000", img: "https://picsum.photos/id/251/300/200", desc: "AC, stage, parking" },
    { id: 2, name: "Mini Hall (60 pax)", price: "₹12,000", img: "https://picsum.photos/id/30/300/200", desc: "Perfect for birthdays" }
];

// ==================== CART ====================
let cart = {
    restaurantId: null,
    items: []
};

function loadCart() {
    const saved = localStorage.getItem('localfoodhub_cart');
    if (saved) {
        cart = JSON.parse(saved);
    }
    updateCartCount();
}

function saveCart() {
    localStorage.setItem('localfoodhub_cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const countEl = document.getElementById('cart-count');
    if (countEl) {
        const totalItems = cart.items.reduce((sum, item) => sum + item.qty, 0);
        countEl.textContent = totalItems;
    }
}

function addToCart(item, restaurantId) {
    if (!cart.restaurantId || cart.restaurantId !== restaurantId) {
        if (cart.items.length > 0 && !confirm("Your cart has items from another restaurant. Clear it?")) {
            return;
        }
        cart.restaurantId = restaurantId;
        cart.items = [];
    }

    const existing = cart.items.find(i => i.id === item.id);
    if (existing) {
        existing.qty++;
    } else {
        cart.items.push({ ...item, qty: 1 });
    }
    saveCart();
    renderCart();
    showModal();
}

// ==================== RENDER FUNCTIONS ====================
function renderFeatured() {
    const grid = document.getElementById('featured-grid');
    if (!grid) return;

    grid.innerHTML = restaurants.map(r => `
        <div class="restaurant-card">
            <img src="${r.img}" alt="${r.name}">
            <div class="card-content">
                <h3>${r.name}</h3>
                <p class="cuisine">${r.cuisine}</p>
                <div class="rating">⭐ ${r.rating}</div>
                <a href="restaurant.html?id=${r.id}" class="btn-primary" style="display:block;text-align:center;padding:10px;margin-top:12px;">View Menu</a>
            </div>
        </div>
    `).join('');
}

function renderAllRestaurants(filtered = restaurants) {
    const grid = document.getElementById('restaurant-grid');
    if (!grid) return;

    grid.innerHTML = filtered.map(r => `
        <div class="restaurant-card">
            <img src="${r.img}" alt="${r.name}">
            <div class="card-content">
                <h3>${r.name}</h3>
                <p class="cuisine">${r.cuisine}</p>
                <div class="rating">⭐ ${r.rating}</div>
                <a href="restaurant.html?id=${r.id}" class="btn-primary" style="display:block;text-align:center;padding:10px;margin-top:12px;">View Menu →</a>
            </div>
        </div>
    `).join('');
}

function filterRestaurants() {
    const term = document.getElementById('restaurant-search').value.toLowerCase();
    const filtered = restaurants.filter(r => 
        r.name.toLowerCase().includes(term) || r.cuisine.toLowerCase().includes(term)
    );
    renderAllRestaurants(filtered);
}

function loadRestaurantPage() {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id'));
    const restaurant = restaurants.find(r => r.id === id);
    if (!restaurant) return;

    // Hero
    const hero = document.getElementById('restaurant-hero');
    hero.style.backgroundImage = `url('${restaurant.cover}')`;
    hero.innerHTML = `<h1>${restaurant.name}</h1>`;

    // About
    document.getElementById('about-section').innerHTML = `
        <h2>About ${restaurant.name}</h2>
        <p>${restaurant.about}</p>
    `;

    // Gallery
    const galleryHTML = restaurant.gallery.map(img => `<img src="${img}" alt="Gallery">`).join('');
    document.getElementById('gallery-grid').innerHTML = galleryHTML;

    // Menu
    let menuHTML = '';
    restaurant.menu.forEach(cat => {
        menuHTML += `<h3 style="margin:30px 0 16px;">${cat.category}</h3>`;
        menuHTML += `<div class="restaurant-grid">`;
        cat.items.forEach(item => {
            menuHTML += `
                <div class="food-card">
                    <img src="${item.img}" alt="${item.name}">
                    <div class="food-info">
                        <h4>${item.name}</h4>
                        <p style="color:#666;font-size:0.9rem;">${item.desc}</p>
                        <p style="font-size:1.3rem;font-weight:700;margin:8px 0;">₹${item.price}</p>
                        <button onclick="addToCartFromPage(${item.id}, ${restaurant.id})" class="add-btn">Add to Cart</button>
                    </div>
                </div>
            `;
        });
        menuHTML += `</div>`;
    });
    document.getElementById('menu-container').innerHTML = menuHTML;
}

function addToCartFromPage(itemId, restaurantId) {
    const restaurant = restaurants.find(r => r.id === restaurantId);
    let item = null;
    for (let cat of restaurant.menu) {
        item = cat.items.find(i => i.id === itemId);
        if (item) break;
    }
    if (item) addToCart(item, restaurantId);
}

// Rooms & Banquet
function renderRooms() {
    const grid = document.getElementById('rooms-grid');
    if (!grid) return;
    grid.innerHTML = roomsData.map(room => `
        <div class="restaurant-card">
            <img src="${room.img}" alt="${room.name}">
            <div class="card-content">
                <h3>${room.name}</h3>
                <p style="color:#666;">${room.desc}</p>
                <p style="font-size:1.4rem;font-weight:700;margin:10px 0;">₹${room.price}/night</p>
                <button onclick="bookRoom('${room.name}')" class="btn-whatsapp">Book via WhatsApp</button>
            </div>
        </div>
    `).join('');
}

function renderBanquet() {
    const grid = document.getElementById('banquet-grid');
    if (!grid) return;
    grid.innerHTML = banquetData.map(b => `
        <div class="restaurant-card">
            <img src="${b.img}" alt="${b.name}">
            <div class="card-content">
                <h3>${b.name}</h3>
                <p style="color:#666;">${b.desc}</p>
                <p style="font-size:1.4rem;font-weight:700;margin:10px 0;">${b.price}</p>
                <button onclick="bookBanquet('${b.name}')" class="btn-whatsapp">Book via WhatsApp</button>
            </div>
        </div>
    `).join('');
}

// Cart rendering
function renderCart() {
    const container = document.getElementById('cart-items');
    if (!container) return;

    if (cart.items.length === 0) {
        container.innerHTML = `<p style="text-align:center;padding:40px;color:#888;">Your cart is empty</p>`;
        document.getElementById('cart-total-price').textContent = '₹0';
        return;
    }

    let html = '';
    let total = 0;

    cart.items.forEach((item, index) => {
        const itemTotal = item.price * item.qty;
        total += itemTotal;
        html += `
            <div class="cart-item">
                <div>
                    <strong>${item.name}</strong><br>
                    <small>₹${item.price} × ${item.qty}</small>
                </div>
                <div class="qty-controls">
                    <button onclick="changeQty(${index}, -1)">−</button>
                    <span style="min-width:24px;text-align:center;">${item.qty}</span>
                    <button onclick="changeQty(${index}, 1)">+</button>
                    <button onclick="removeFromCart(${index})" style="margin-left:12px;color:#e11d48;">🗑</button>
                </div>
                <div style="font-weight:700;">₹${itemTotal}</div>
            </div>
        `;
    });

    container.innerHTML = html;
    document.getElementById('cart-total-price').textContent = `₹${total}`;
}

function changeQty(index, change) {
    cart.items[index].qty += change;
    if (cart.items[index].qty < 1) cart.items.splice(index, 1);
    saveCart();
    renderCart();
}

function removeFromCart(index) {
    cart.items.splice(index, 1);
    if (cart.items.length === 0) cart.restaurantId = null;
    saveCart();
    renderCart();
}

function clearCart() {
    cart.items = [];
    cart.restaurantId = null;
    saveCart();
    renderCart();
}

function showModal() {
    const modal = document.getElementById('cart-modal');
    renderCart();
    modal.style.display = 'flex';
}

function orderOnWhatsApp() {
    if (cart.items.length === 0) return;

    const restaurant = restaurants.find(r => r.id === cart.restaurantId);
    if (!restaurant) return;

    let message = `Hello! I want to order from *${restaurant.name}* via LocalFood Hub\n\n`;
    let total = 0;

    cart.items.forEach(item => {
        const itemTotal = item.price * item.qty;
        total += itemTotal;
        message += `• ${item.qty}× ${item.name} - ₹${itemTotal}\n`;
    });

    message += `\n*Total: ₹${total}*\n\nPlease confirm my order!`;

    const whatsappUrl = `https://wa.me/${restaurant.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    // Clear cart after order
    setTimeout(() => {
        clearCart();
        document.getElementById('cart-modal').style.display = 'none';
    }, 800);
}

// Booking functions
function bookRoom(name) {
    const msg = `Hello! I would like to book the *${name}* at LocalFood Hub. Please confirm availability.`;
    window.open(`https://wa.me/919876543210?text=${encodeURIComponent(msg)}`, '_blank');
}

function bookBanquet(name) {
    const msg = `Hello! I want to book the *${name}* for my event. Please share details.`;
    window.open(`https://wa.me/919876543210?text=${encodeURIComponent(msg)}`, '_blank');
}

function handleContact(e) {
    e.preventDefault();
    alert("Thank you! Your message has been sent. We'll reply on WhatsApp soon.");
}

// Search from home
function searchFromHome() {
    const term = document.getElementById('home-search').value.trim();
    if (term) {
        window.location.href = `restaurants.html`;
    } else {
        window.location.href = `restaurants.html`;
    }
}

// ==================== INIT ====================
function init() {
    loadCart();

    // Cart button
    const cartBtn = document.getElementById('cart-btn');
    const closeBtn = document.getElementById('modal-close');
    if (cartBtn) cartBtn.addEventListener('click', showModal);
    if (closeBtn) closeBtn.addEventListener('click', () => {
        document.getElementById('cart-modal').style.display = 'none';
    });

    // Page specific
    if (document.getElementById('featured-grid')) {
        renderFeatured();
    }
    if (document.getElementById('restaurant-grid')) {
        renderAllRestaurants();
    }
    if (window.location.pathname.includes('restaurant.html')) {
        loadRestaurantPage();
    }
    if (document.getElementById('rooms-grid')) {
        renderRooms();
    }
    if (document.getElementById('banquet-grid')) {
        renderBanquet();
    }
}

window.onload = init;
