// ডাটাবেস সিমুলেশন
let products = [
    { id: 1, name: "AI স্মার্টওয়াচ", price: 12999, image: "https://picsum.photos/200/200?random=1" },
    { id: 2, name: "ওয়্যারলেস ইয়ারবাড", price: 3999, image: "https://picsum.photos/200/200?random=2" },
    { id: 3, name: "ডিজাইন শার্ট", price: 1499, image: "https://picsum.photos/200/200?random=3" },
    { id: 4, name: "জিন্স প্যান্ট", price: 2499, image: "https://picsum.photos/200/200?random=4" }
];

let cart = [];

// লোড হওয়ার সময় পণ্য দেখান
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    updateCartBadge();
});

function loadProducts() {
    const grid = document.querySelector('.products-grid');
    if (!grid) return;
    
    grid.innerHTML = products.map(product => `
        <div class="product-card" onclick="addToCart(${product.id})">
            <img src="${product.image}" style="width:100%; border-radius:8px">
            <h3>${product.name}</h3>
            <p>${product.price} টাকা</p>
            <button style="background:#667eea; border:none; padding:8px; border-radius:8px; cursor:pointer">
                কার্টে যোগ করুন
            </button>
        </div>
    `).join('');
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    cart.push(product);
    updateCartBadge();
    alert(`${product.name} কার্টে যোগ হয়েছে!`);
}

function updateCartBadge() {
    const badges = document.querySelectorAll('.cart-badge');
    badges.forEach(badge => {
        if (badge) badge.textContent = cart.length;
    });
    
    // লোকাল স্টোরেজে সেভ করুন
    localStorage.setItem('cart', JSON.stringify(cart));
}

function startVoiceSearch() {
    if ('webkitSpeechRecognition' in window) {
        const recognition = new webkitSpeechRecognition();
        recognition.lang = 'bn-BD';
        recognition.start();
        recognition.onresult = (event) => {
            const text = event.results[0][0].transcript;
            alert(`আপনি বলেছেন: ${text}\nAI সার্চ করছে...`);
        };
    } else {
        alert('ভয়েস সার্চ আপনার ব্রাউজারে সাপোর্ট করে না');
    }
}

function toggleChat() {
    alert('AI চ্যাটবট আসছে শীঘ্রই...');
}