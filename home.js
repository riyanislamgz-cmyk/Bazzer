// current user
let user = JSON.parse(localStorage.getItem('bazzer_current_user'));
if (!user) {
    window.location.href = 'index.html';
}

// গ্লোবাল ডাটা
let tasks = JSON.parse(localStorage.getItem('bazzer_tasks')) || [
    { id: 'task1', title: '📢 রেফারেল লিংক শেয়ার করো', reward: 30, type: 'share' },
    { id: 'task2', title: 'প্রোফাইল সম্পূর্ণ করো', reward: 20, type: 'profile' }
];
let ads = JSON.parse(localStorage.getItem('bazzer_ads')) || [
    { id: 'ad1', title: 'স্পেশাল সেল: ৫০% ছাড়', reward: 10 },
    { id: 'ad2', title: 'নতুন পণ্য লঞ্চ', reward: 15 }
];
let sellOffers = JSON.parse(localStorage.getItem('bazzer_sell_offers')) || [];
let pointHistory = JSON.parse(localStorage.getItem('bazzer_history')) || [];

function saveAll() {
    localStorage.setItem('bazzer_current_user', JSON.stringify(user));
    localStorage.setItem('bazzer_tasks', JSON.stringify(tasks));
    localStorage.setItem('bazzer_ads', JSON.stringify(ads));
    localStorage.setItem('bazzer_sell_offers', JSON.stringify(sellOffers));
    localStorage.setItem('bazzer_history', JSON.stringify(pointHistory));
    updateUI();
}

function addPoints(amount, reason) {
    user.points += amount;
    pointHistory.unshift({ date: new Date().toLocaleString(), amount, reason });
    saveAll();
}

function updateUI() {
    document.getElementById('pointsHeader').innerHTML = `⭐ ${user.points}`;
    document.getElementById('welcomeName').innerText = user.username;
    document.getElementById('myPoints').innerText = user.points;
    document.getElementById('referralCodeBox').innerText = user.referralCode;
    document.getElementById('editUsername').value = user.username;
    document.getElementById('editBio').value = user.bio || '';
    document.getElementById('profilePic').innerHTML = user.profilePic || '😊';
    renderTasks();
    renderAds();
    renderSellOffers();
    renderTopSell();
}

function renderTasks() {
    const container = document.getElementById('taskList');
    if(!container) return;
    container.innerHTML = '';
    tasks.forEach(task => {
        const done = user.tasksCompleted?.includes(task.id) || false;
        const div = document.createElement('div');
        div.className = 'task-item';
        div.innerHTML = `
            <div><strong>${task.title}</strong><br>🎁 ${task.reward} পয়েন্ট</div>
            ${!done ? `<button class="btn-sm" onclick="completeTask('${task.id}')">সম্পন্ন করুন</button>` : '<span>✅ সম্পন্ন</span>'}
        `;
        container.appendChild(div);
    });
}

window.completeTask = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if(!task || user.tasksCompleted?.includes(taskId)) return alert('আগেই করেছেন');
    if(task.type === 'share') {
        navigator.clipboard.writeText(`https://bazzer.com/ref/${user.referralCode}`);
        alert('রেফার লিংক কপি হয়েছে! শেয়ার করুন।');
    }
    addPoints(task.reward, `টাস্ক: ${task.title}`);
    user.tasksCompleted = user.tasksCompleted || [];
    user.tasksCompleted.push(taskId);
    saveAll();
};

function renderAds() {
    const container = document.getElementById('adList');
    if(!container) return;
    container.innerHTML = '';
    ads.forEach(ad => {
        const watched = user.adsWatched?.includes(ad.id);
        const div = document.createElement('div');
        div.className = 'ad-item';
        div.innerHTML = `
            <div><strong>📺 ${ad.title}</strong><br>💰 ${ad.reward} পয়েন্ট</div>
            ${!watched ? `<button class="btn-sm" onclick="watchAd('${ad.id}')">দেখে নিন</button>` : '✅ দেখা হয়েছে'}
        `;
        container.appendChild(div);
    });
}

window.watchAd = (adId) => {
    if(user.adsWatched?.includes(adId)) return alert('আগে দেখেছেন');
    const ad = ads.find(a => a.id === adId);
    addPoints(ad.reward, `অ্যাড দেখেছেন: ${ad.title}`);
    user.adsWatched = user.adsWatched || [];
    user.adsWatched.push(adId);
    saveAll();
};

function renderSellOffers() {
    const container = document.getElementById('sellOffersList');
    if(!container) return;
    container.innerHTML = '';
    sellOffers.forEach(offer => {
        const div = document.createElement('div');
        div.className = 'sell-item';
        div.innerHTML = `<div><strong>${offer.title}</strong> - ${offer.price} ৳<br><small>বিক্রেতা: ${offer.seller}</small></div>
        <button class="btn-sm" onclick="buyItem('${offer.id}')">কিনুন</button>`;
        container.appendChild(div);
    });
}

window.buyItem = (id) => {
    const item = sellOffers.find(s => s.id === id);
    if(confirm(`'${item.title}' কিনতে চান? মূল্য ${item.price} ৳ (পয়েন্ট ব্যবহার করবেন?)`)) {
        alert('ডেমো: পেমেন্ট সিস্টেম শীঘ্রই আসছে');
    }
};

function renderTopSell() {
    const container = document.getElementById('topSellOffers');
    if(container && sellOffers.length) {
        container.innerHTML = sellOffers.slice(0,2).map(s => `<div>🔥 ${s.title} - ${s.price}৳</div>`).join('');
    }
}

document.getElementById('newSellBtn')?.addEventListener('click', () => {
    let title = prompt('পণ্যের নাম:');
    let price = prompt('মূল্য (টাকায়):');
    if(title && price) {
        sellOffers.push({ id: Date.now().toString(), title, price, seller: user.username });
        saveAll();
        alert('আপনার সেল অফার যোগ হয়েছে!');
    }
});

document.getElementById('saveProfileBtn')?.addEventListener('click', () => {
    user.username = document.getElementById('editUsername').value || user.username;
    user.bio = document.getElementById('editBio').value;
    saveAll();
    alert('প্রোফাইল সেভ হয়েছে');
});
document.getElementById('profilePic')?.addEventListener('click', () => {
    let emoji = prompt('নতুন ইমোজি দিন (যেমন 🚀, 😎):', user.profilePic);
    if(emoji) user.profilePic = emoji;
    saveAll();
});

document.getElementById('shareReferBtn')?.addEventListener('click', () => {
    navigator.clipboard.writeText(`BazzeR রেফার কোড: ${user.referralCode}\nhttps://bazzer.com/ref/${user.referralCode}`);
    alert('রেফার লিংক কপি! শেয়ার করে পয়েন্ট পান।');
});

document.getElementById('useReferBtn')?.addEventListener('click', () => {
    let refCode = document.getElementById('applyReferCode').value.trim().toUpperCase();
    if(!refCode) return alert('কোড দিন');
    if(user.referredBy) return alert('আপনি ইতিমধ্যে রেফার কোড ব্যবহার করেছেন');
    // অন্য ইউজার খুঁজি
    let allUsers = JSON.parse(localStorage.getItem('bazzer_users')) || [];
    let referrer = allUsers.find(u => u.referralCode === refCode && u.id !== user.id);
    if(referrer) {
        user.referredBy = referrer.id;
        addPoints(20, 'রেফারেল কোড ব্যবহার');
        referrer.points += 50;
        // আপডেট ইউজার লিস্ট
        const index = allUsers.findIndex(u => u.id === referrer.id);
        if(index !== -1) allUsers[index] = referrer;
        localStorage.setItem('bazzer_users', JSON.stringify(allUsers));
        saveAll();
        alert(`সফল! আপনি +২০ পয়েন্ট পেলেন, রেফারার +৫০ পেলেন।`);
    } else alert('ভুল কোড বা ইউজার নেই');
});

document.getElementById('darkModeToggle')?.addEventListener('click', () => {
    document.body.style.background = document.body.style.background === '#0f172a' ? '#f8fafc' : '#0f172a';
    document.querySelector('.app').style.background = document.body.style.background === '#0f172a' ? '#1e293b' : 'white';
});
document.getElementById('clearDataBtn')?.addEventListener('click', () => {
    if(confirm('সব ডাটা রিসেট হবে। লগআউট হবে')) {
        localStorage.clear();
        window.location.href = 'index.html';
    }
});
document.getElementById('logoutBtn')?.addEventListener('click', () => {
    localStorage.removeItem('bazzer_current_user');
    window.location.href = 'index.html';
});
document.getElementById('historyBtn')?.addEventListener('click', () => {
    let msg = pointHistory.map(h => `${h.date} : ${h.amount} পয়েন্ট (${h.reason})`).join('\n') || 'কোনো ইতিহাস নেই';
    alert(msg);
});

// অ্যাডমিন ফাংশন (অ্যাড/টাস্ক যোগ)
document.getElementById('adminAddTask')?.addEventListener('click', () => {
    let title = prompt('নতুন টাস্কের নাম:');
    let reward = parseInt(prompt('পয়েন্ট রিওয়ার্ড:'));
    if(title && reward) tasks.push({ id: 'task'+Date.now(), title, reward, type:'custom' });
    saveAll();
});
document.getElementById('adminAddAd')?.addEventListener('click', () => {
    let title = prompt('অ্যাডের বিবরণ:');
    let reward = parseInt(prompt('পয়েন্ট:'));
    if(title && reward) ads.push({ id: 'ad'+Date.now(), title, reward });
    saveAll();
});

// নেভিগেশন
document.querySelectorAll('.nav-item').forEach(nav => {
    nav.addEventListener('click', () => {
        let pageId = nav.dataset.page;
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById(pageId+'Page').classList.add('active');
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        nav.classList.add('active');
        if(pageId === 'market') renderSellOffers();
        if(pageId === 'earn') { renderTasks(); renderAds(); }
    });
});

updateUI();