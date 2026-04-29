// প্রোডাক্ট ডাটাবেস
const products = [
    { id: 1, name: "ওয়্যারলেস ইয়ারবাড", price: 2490, rating: 4.5, image: "https://picsum.photos/id/1/200/200", category: "electronics", desc: "ব্লুটুথ 5.0, ২০ ঘণ্টা ব্যাটারি লাইফ, নয়েজ ক্যানসেলিং" },
    { id: 2, name: "স্মার্ট ওয়াচ প্রো", price: 4590, rating: 4.8, image: "https://picsum.photos/id/0/200/200", category: "electronics", desc: "হার্ট রেট মনিটর, স্পোর্টস মোড, ওয়াটার রেসিস্টেন্ট" },
    { id: 3, name: "মিনিমাল শার্ট", price: 890, rating: 4.2, image: "https://picsum.photos/id/20/200/200", category: "fashion", desc: "কটন ফেব্রিক, স্লিম ফিট, গ্রীষ্মের জন্য পারফেক্ট" },
    { id: 4, name: "স্কিন কেয়ার সেট", price: 1590, rating: 4.6, image: "https://picsum.photos/id/29/200/200", category: "beauty", desc: "ফেস ওয়াশ + ময়েশ্চারাইজার + সিরাম" },
    { id: 5, name: "পাওয়ার ব্যাংক", price: 1290, rating: 4.4, image: "https://picsum.photos/id/2/200/200", category: "electronics", desc: "১০০০০ এমএএহ, ফাস্ট চার্জিং" },
    { id: 6, name: "ডিজাইনার জিন্স", price: 1890, rating: 4.3, image: "https://picsum.photos/id/26/200/200", category: "fashion", desc: "স্ট্রেচেবল, আরামদায়ক" }
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentCategory = 'all';
let currentSearch = '';

// কার্ট ফাংশন
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
}

function updateCartUI() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCountBadge').innerText = count;
    
    const cartItemsDiv = document.getElementById('cartItemsList');
    if (cartItemsDiv) {
        if (cart.length === 0) {
            cartItemsDiv.innerHTML = '<p style="text-align:center;">🛍️ কার্ট খালি</p>';
            document.getElementById('cartTotal').innerHTML = 'মোট: ০ ৳';
        } else {
            cartItemsDiv.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <img class="cart-item-img" src="${item.image}" alt="${item.name}">
                    <div class="cart-item-details">
                        <strong>${item.name}</strong><br>
                        ${item.price} ৳ x ${item.quantity}
                    </div>
                    <button class="remove-item" onclick="removeFromCart(${item.id})">রিমুভ</button>
                </div>
            `).join('');
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            document.getElementById('cartTotal').innerHTML = `মোট: ${total} ৳`;
        }
    }
}

window.addToCart = function(productId) {
    const product = products.find(p => p.id === productId);
    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    saveCart();
    alert(`${product.name} কার্টে যোগ হয়েছে!`);
}

window.removeFromCart = function(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    if (document.getElementById('cartPage').classList.contains('active-page')) updateCartUI();
}

// প্রোডাক্ট ডিটেইল
window.showProductDetail = function(productId) {
    const product = products.find(p => p.id === productId);
    const detailContainer = document.getElementById('productDetailContainer');
    detailContainer.innerHTML = `
        <div class="detail-container">
            <img class="detail-image" src="${product.image}" alt="${product.name}">
            <div class="detail-info">
                <div class="detail-title">${product.name}</div>
                <div class="detail-price">${product.price} ৳</div>
                <div class="detail-rating">⭐ ${product.rating} / 5</div>
                <div class="detail-description">${product.desc}</div>
                <button class="add-to-cart" onclick="addToCart(${product.id}); showHomeFromDetail();">🛒 কার্টে যোগ করুন</button>
            </div>
        </div>
    `;
    setActivePage('detail');
}

window.showHomeFromDetail = function() {
    setActivePage('home');
    renderProducts();
}

window.backToCart = function() {
    setActivePage('cart');
    updateCartUI();
}

// প্রোডাক্ট রেন্ডার
function renderProducts() {
    let filtered = products;
    if (currentCategory !== 'all') {
        filtered = filtered.filter(p => p.category === currentCategory);
    }
    if (currentSearch.trim() !== '') {
        filtered = filtered.filter(p => p.name.toLowerCase().includes(currentSearch.toLowerCase()));
    }
    const container = document.getElementById('productsContainer');
    container.innerHTML = filtered.map(product => `
        <div class="product-card" onclick="showProductDetail(${product.id})">
            <img class="product-img" src="${product.image}" alt="${product.name}">
            <div class="product-info">
                <div class="product-title">${product.name}</div>
                <div class="price">${product.price} ৳</div>
                <div class="rating">⭐ ${product.rating}</div>
                <button class="add-to-cart" onclick="event.stopPropagation(); addToCart(${product.id})">➕ কার্টে নিন</button>
            </div>
        </div>
    `).join('');
}

// পেজ সুইচিং
function setActivePage(pageName) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active-page'));
    document.getElementById(`${pageName}Page`).classList.add('active-page');
    
    document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.nav-icon').forEach(icon => icon.classList.remove('active'));
    
    if (pageName === 'home') {
        document.querySelector('.nav-tab[data-tab="home"]').classList.add('active');
        document.querySelector('.nav-icon[data-nav="home"]').classList.add('active');
        renderProducts();
    } else if (pageName === 'cart') {
        document.querySelector('.nav-tab[data-tab="cart"]').classList.add('active');
        document.querySelector('.nav-icon[data-nav="cart"]').classList.add('active');
        updateCartUI();
    }
}

// ইভেন্ট লিসেনার
document.getElementById('darkModeToggle').addEventListener('click', () => {
    document.body.classList.toggle('dark');
});

document.getElementById('searchInput').addEventListener('input', (e) => {
    currentSearch = e.target.value;
    if (document.getElementById('homePage').classList.contains('active-page')) {
        renderProducts();
    }
});

document.querySelectorAll('.cat-item').forEach(cat => {
    cat.addEventListener('click', () => {
        currentCategory = cat.getAttribute('data-cat');
        if (document.getElementById('homePage').classList.contains('active-page')) {
            renderProducts();
        }
    });
});

document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        const tabName = tab.getAttribute('data-tab');
        setActivePage(tabName);
    });
});

document.querySelectorAll('.nav-icon').forEach(icon => {
    icon.addEventListener('click', () => {
        const navName = icon.getAttribute('data-nav');
        setActivePage(navName);
    });
});

document.getElementById('checkoutBtn').addEventListener('click', () => {
    if (cart.length === 0) {
        alert('কার্ট খালি! কিছু যোগ করুন প্রথমে।');
        return;
    }
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('checkoutDetails').innerHTML = `
        <p><strong>মোট পণ্য:</strong> ${cart.length}টি</p>
        <p><strong>মোট মূল্য:</strong> ${total} ৳</p>
        <p><strong>ডেলিভারি চার্জ:</strong> ৬০ ৳</p>
        <hr>
        <p><strong>পেবল যোগফল:</strong> ${total + 60} ৳</p>
    `;
    setActivePage('checkout');
});

document.getElementById('confirmOrderBtn').addEventListener('click', () => {
    const address = document.getElementById('addressInput').value;
    if (!address) {
        alert('দয়া করে ঠিকানা লিখুন!');
        return;
    }
    alert(`✅ অর্ডার কনফার্ম হয়েছে!\nডেলিভারি ঠিকানা: ${address}\nধন্যবাদ কেনাকাটার জন্য!`);
    cart = [];
    saveCart();
    setActivePage('home');
    renderProducts();
});

// স্লাইডার ক্লিক ইভেন্ট
document.getElementById('sliderClick').addEventListener('click', () => {
    alert("🔥 চলছে ভাই প্রচুর অফার! এখনই কিনুন।");
});

// ইনিশিয়াল রেন্ডার
renderProducts();
updateCartUI();