// ইউজার চেক
const user = JSON.parse(localStorage.getItem('bazzer_user'));

if (!user) {
    window.location.href = 'index.html';
}

document.getElementById('userName').innerText = user.name;
document.getElementById('userInfo').innerHTML = `👤 ${user.name}`;

// প্রোডাক্ট ডাটা
const products = [
    { id: 1, name: "ওয়্যারলেস ইয়ারবাড", price: 2490, image: "https://picsum.photos/id/1/200/200" },
    { id: 2, name: "স্মার্ট ওয়াচ", price: 4590, image: "https://picsum.photos/id/0/200/200" },
    { id: 3, name: "ফ্যাশনেবল শার্ট", price: 890, image: "https://picsum.photos/id/20/200/200" },
    { id: 4, name: "পাওয়ার ব্যাংক", price: 1290, image: "https://picsum.photos/id/2/200/200" },
    { id: 5, name: "স্কিন কেয়ার সেট", price: 1590, image: "https://picsum.photos/id/29/200/200" },
    { id: 6, name: "ডিজাইনার জিন্স", price: 1890, image: "https://picsum.photos/id/26/200/200" }
];

// প্রোডাক্ট শো
const productsGrid = document.getElementById('productsGrid');
products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <img class="product-img" src="${product.image}" alt="${product.name}">
        <h4>${product.name}</h4>
        <div class="price">${product.price} ৳</div>
    `;
    card.onclick = () => alert(`${product.name} - ${product.price}৳\nকার্টে যোগ করতে শীঘ্রই আসছে!`);
    productsGrid.appendChild(card);
});

// লগআউট
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('bazzer_user');
    window.location.href = 'index.html';
});