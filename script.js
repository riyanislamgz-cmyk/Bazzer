// ইউজার ডাটাবেস (localStorage)
let users = JSON.parse(localStorage.getItem('bazzer_users')) || [];

// রেফারেল সিস্টেমের জন্য ডিফল্ট
function saveUsers() {
    localStorage.setItem('bazzer_users', JSON.stringify(users));
}

// গেস্ট লগইন
document.getElementById('guestLoginBtn')?.addEventListener('click', () => {
    let guestUser = {
        id: 'guest_' + Date.now(),
        username: 'গেস্ট ইউজার',
        email: null,
        phone: null,
        password: null,
        points: 50,
        referralCode: 'GUEST' + Math.floor(Math.random()*10000),
        referredBy: null,
        tasksCompleted: [],
        adsWatched: [],
        bio: 'আমি একজন গেস্ট ইউজার',
        profilePic: '👤',
        joinDate: new Date().toISOString()
    };
    users.push(guestUser);
    saveUsers();
    localStorage.setItem('bazzer_current_user', JSON.stringify(guestUser));
    window.location.href = 'home.html';
});

// ট্যাব সুইচ
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const tab = btn.dataset.tab;
        document.getElementById('loginForm').classList.toggle('active', tab === 'login');
        document.getElementById('registerForm').classList.toggle('active', tab === 'register');
    });
});

// রেজিস্ট্রেশন
document.getElementById('doRegisterBtn')?.addEventListener('click', () => {
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const phone = document.getElementById('regPhone').value.trim();
    const pass = document.getElementById('regPassword').value;
    const refBy = document.getElementById('refCode').value.trim().toUpperCase();

    if(!name || (!email && !phone) || pass.length < 6) {
        alert('নাম, ইমেইল/ফোন এবং ৬ অক্ষরের পাসওয়ার্ড দিন');
        return;
    }
    // চেক ইউজার আছে কিনা
    const exist = users.find(u => u.email === email || u.phone === phone);
    if(exist) {
        alert('এই ইমেইল বা ফোন ইতিমধ্যে ব্যবহৃত হচ্ছে');
        return;
    }

    // রেফারাল কোড জেনারেট
    const newReferralCode = name.slice(0,3).toUpperCase() + Math.floor(1000+Math.random()*9000);
    let referrer = null;
    if(refBy) {
        referrer = users.find(u => u.referralCode === refBy);
    }

    const newUser = {
        id: 'user_' + Date.now(),
        username: name,
        email: email || null,
        phone: phone || null,
        password: pass,
        points: referrer ? 20 : 0,   // রেফারালে ২০ পয়েন্ট
        referralCode: newReferralCode,
        referredBy: referrer ? referrer.id : null,
        tasksCompleted: [],
        adsWatched: [],
        bio: `হ্যালো, আমি ${name}`,
        profilePic: '😊',
        joinDate: new Date().toISOString()
    };
    users.push(newUser);
    if(referrer) {
        // রেফারার পাবে ৫০ পয়েন্ট
        referrer.points = (referrer.points || 0) + 50;
        // আপডেট ইউজার লিস্ট
        const index = users.findIndex(u => u.id === referrer.id);
        if(index !== -1) users[index] = referrer;
    }
    saveUsers();
    localStorage.setItem('bazzer_current_user', JSON.stringify(newUser));
    alert('অ্যাকাউন্ট তৈরি হয়েছে! '+ (referrer ? '+২০ পয়েন্ট পেলেন, রেফারার +৫০ পেলেন' : ''));
    window.location.href = 'home.html';
});

// লগইন
document.getElementById('doLoginBtn')?.addEventListener('click', () => {
    const identifier = document.getElementById('loginEmail').value.trim();
    const pass = document.getElementById('loginPassword').value;
    const user = users.find(u => (u.email === identifier || u.phone === identifier) && u.password === pass);
    if(user) {
        localStorage.setItem('bazzer_current_user', JSON.stringify(user));
        window.location.href = 'home.html';
    } else {
        alert('ভুল তথ্য বা পাসওয়ার্ড');
    }
});