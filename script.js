// লগইন স্টোরেজ
let currentUser = null;

// মোডাল এলিমেন্টস
const phoneModal = document.getElementById('phoneModal');
const gmailModal = document.getElementById('gmailModal');
const signupModal = document.getElementById('signupModal');

// গেস্ট লগইন
document.getElementById('guestLogin').addEventListener('click', () => {
    currentUser = {
        name: 'গেস্ট ইউজার',
        type: 'guest',
        email: null,
        phone: null
    };
    localStorage.setItem('bazzer_user', JSON.stringify(currentUser));
    showSuccessAndRedirect('গেস্ট হিসেবে লগইন সফল!');
});

// Gmail লগইন বাটন
document.getElementById('gmailLogin').addEventListener('click', () => {
    gmailModal.style.display = 'flex';
});

// Gmail মোডাল বন্ধ
document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
        phoneModal.style.display = 'none';
        gmailModal.style.display = 'none';
        signupModal.style.display = 'none';
    });
});

// Gmail লগইন কনফার্ম
document.getElementById('gmailLoginBtn').addEventListener('click', () => {
    const email = document.getElementById('gmailEmail').value;
    if (!email || !email.includes('@')) {
        alert('বৈধ ইমেইল ঠিকানা দিন!');
        return;
    }
    currentUser = {
        name: email.split('@')[0],
        type: 'gmail',
        email: email,
        phone: null
    };
    localStorage.setItem('bazzer_user', JSON.stringify(currentUser));
    showSuccessAndRedirect(`${email} দিয়ে লগইন সফল!`);
    gmailModal.style.display = 'none';
});

// ফোন লগইন
document.getElementById('phoneLogin').addEventListener('click', () => {
    phoneModal.style.display = 'flex';
});

// OTP সেন্ড
document.getElementById('sendOtpBtn').addEventListener('click', () => {
    const phone = document.getElementById('phoneNumber').value;
    if (!phone || phone.length < 11) {
        alert('বৈধ ফোন নম্বর দিন (01XXXXXXXXX)');
        return;
    }
    // OTP সিমুলেশন
    alert(`OTP পাঠানো হয়েছে: 123456 (ডেমো)`);
    document.getElementById('otpSection').style.display = 'block';
});

// OTP ভেরিফাই
document.getElementById('verifyOtpBtn').addEventListener('click', () => {
    const otp = document.getElementById('otpCode').value;
    if (otp === '123456') {
        const phone = document.getElementById('phoneNumber').value;
        currentUser = {
            name: `User_${phone.slice(-4)}`,
            type: 'phone',
            email: null,
            phone: phone
        };
        localStorage.setItem('bazzer_user', JSON.stringify(currentUser));
        showSuccessAndRedirect(`${phone} নম্বর দিয়ে লগইন সফল!`);
        phoneModal.style.display = 'none';
    } else {
        alert('ভুল OTP! সঠিক OTP: 123456');
    }
});

// সাইন আপ লিংক
document.getElementById('signupLink').addEventListener('click', (e) => {
    e.preventDefault();
    signupModal.style.display = 'flex';
});

// অ্যাকাউন্ট তৈরি
document.getElementById('createAccountBtn').addEventListener('click', () => {
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const phone = document.getElementById('signupPhone').value;
    const password = document.getElementById('signupPass').value;
    
    if (!name || !email || !phone || !password) {
        alert('সব তথ্য পূরণ করুন!');
        return;
    }
    
    if (password.length < 6) {
        alert('পাসওয়ার্ড কমপক্ষে ৬ ডিজিটের হতে হবে!');
        return;
    }
    
    currentUser = {
        name: name,
        type: 'registered',
        email: email,
        phone: phone
    };
    localStorage.setItem('bazzer_user', JSON.stringify(currentUser));
    showSuccessAndRedirect(`${name}! আপনার অ্যাকাউন্ট তৈরি হয়েছে।`);
    signupModal.style.display = 'none';
});

// সাকসেস মেসেজ ও রিডাইরেক্ট
function showSuccessAndRedirect(message) {
    // চেক করুন আগে থেকে লগইন করা ইউজার আছে কিনা
    const existingUser = localStorage.getItem('bazzer_user');
    if (existingUser && !confirm('আপনি ইতিমধ্যে লগইন করেছেন। নতুন করে লগইন করবেন?')) {
        return;
    }
    
    alert(message + '\n\nহোমপেজে রিডাইরেক্ট হচ্ছে...');
    
    // ইউজার ডাটা সেভ করে হোম পেজে পাঠান
    window.location.href = 'home.html';
}

// মোডালের বাইরে ক্লিক করলে বন্ধ
window.onclick = function(event) {
    if (event.target === phoneModal) phoneModal.style.display = 'none';
    if (event.target === gmailModal) gmailModal.style.display = 'none';
    if (event.target === signupModal) signupModal.style.display = 'none';
}

// পেইজ লোড হলে আগের লগইন চেক করা
window.addEventListener('load', () => {
    const savedUser = localStorage.getItem('bazzer_user');
    if (savedUser) {
        const user = JSON.parse(savedUser);
        if (confirm(`আপনি আগে ${user.name} হিসেবে লগইন করেছিলেন। হোমপেজে যেতে চান?`)) {
            window.location.href = 'home.html';
        }
    }
});