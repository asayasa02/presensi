/**
 * Storage.js - LocalStorage Management
 * Handles all data operations
 */

// ============================================
// INITIALIZATION
// ============================================

function initDemoData() {
    if (localStorage.getItem('absensi_initialized')) return;
    
    const users = [
        {
            id: 1,
            nama: 'Administrator',
            email: 'admin@sekolah.com',
            password: 'admin123',
            role: 'admin',
            status: 'aktif',
            createdAt: new Date().toISOString()
        },
        {
            id: 2,
            nama: 'Ahmad Fauzi S.Pd',
            nip: '198001152010011001',
            email: 'ahmad@sekolah.com',
            password: 'guru123',
            mapel: 'Matematika',
            telepon: '081234567890',
            role: 'guru',
            status: 'aktif',
            createdAt: new Date().toISOString()
        },
        {
            id: 3,
            nama: 'Dewi Lestari S.Pd',
            nip: '198505202010012002',
            email: 'dewi@sekolah.com',
            password: 'guru123',
            mapel: 'IPA',
            telepon: '081234567891',
            role: 'guru',
            status: 'aktif',
            createdAt: new Date().toISOString()
        },
        {
            id: 4,
            nama: 'Budi Santoso M.Pd',
            nip: '197803102005011003',
            email: 'budi@sekolah.com',
            password: 'guru123',
            mapel: 'Bahasa Indonesia',
            telepon: '081234567892',
            role: 'guru',
            status: 'aktif',
            createdAt: new Date().toISOString()
        },
        {
            id: 5,
            nama: 'Siti Aminah S.Pd',
            nip: '199004152015022004',
            email: 'siti@sekolah.com',
            password: 'guru123',
            mapel: 'Bahasa Inggris',
            telepon: '081234567893',
            role: 'guru',
            status: 'aktif',
            createdAt: new Date().toISOString()
        },
        {
            id: 6,
            nama: 'Eko Prasetyo S.Pd',
            nip: '198802202012011005',
            email: 'eko@sekolah.com',
            password: 'guru123',
            mapel: 'IPS',
            telepon: '081234567894',
            role: 'guru',
            status: 'aktif',
            createdAt: new Date().toISOString()
        }
    ];
    
    const settings = {
        nama_sekolah: 'SMP Negeri 1 Contoh',
        jam_masuk: '07:00',
        jam_terlambat: '07:30',
        qr_expired_minutes: 120
    };
    
    localStorage.setItem('absensi_users', JSON.stringify(users));
    localStorage.setItem('absensi_settings', JSON.stringify(settings));
    localStorage.setItem('absensi_attendances', JSON.stringify([]));
    localStorage.setItem('absensi_leaves', JSON.stringify([]));
    localStorage.setItem('absensi_qrcodes', JSON.stringify([]));
    localStorage.setItem('absensi_initialized', 'true');
}

// ============================================
// USER MANAGEMENT
// ============================================

function getUsers() {
    return JSON.parse(localStorage.getItem('absensi_users') || '[]');
}

function getUserById(id) {
    return getUsers().find(u => u.id === id) || null;
}

function getUserByEmail(email) {
    return getUsers().find(u => u.email === email) || null;
}

function addUser(data) {
    const users = getUsers();
    users.push(data);
    localStorage.setItem('absensi_users', JSON.stringify(users));
    return data;
}

function updateUser(id, data) {
    const users = getUsers();
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return null;
    users[index] = { ...users[index], ...data };
    localStorage.setItem('absensi_users', JSON.stringify(users));
    return users[index];
}

function deleteUser(id) {
    const users = getUsers().filter(u => u.id !== id);
    localStorage.setItem('absensi_users', JSON.stringify(users));
    return true;
}

// ============================================
// AUTHENTICATION
// ============================================

function authenticateUser(email, password) {
    const user = getUserByEmail(email);
    if (user && user.password === password && user.status !== 'nonaktif') {
        return user;
    }
    return null;
}

function saveSession(user, remember = false) {
    const session = {
        id: user.id,
        nama: user.nama,
        email: user.email,
        role: user.role,
        loginAt: new Date().toISOString()
    };
    
    if (remember) {
        localStorage.setItem('absensi_session', JSON.stringify(session));
    } else {
        sessionStorage.setItem('absensi_session', JSON.stringify(session));
    }
}

function getSession() {
    const session = localStorage.getItem('absensi_session') || sessionStorage.getItem('absensi_session');
    return session ? JSON.parse(session) : null;
}

function clearSession() {
    localStorage.removeItem('absensi_session');
    sessionStorage.removeItem('absensi_session');
}

// ============================================
// ATTENDANCE MANAGEMENT
// ============================================

function getAttendances() {
    return JSON.parse(localStorage.getItem('absensi_attendances') || '[]');
}

function getAttendancesByUserId(userId) {
    return getAttendances().filter(a => a.userId === userId);
}

function getTodayAttendance(userId) {
    const today = new Date().toISOString().split('T')[0];
    return getAttendances().find(a => a.userId === userId && a.tanggal === today) || null;
}

function addAttendance(data) {
    const attendances = getAttendances();
    attendances.push(data);
    localStorage.setItem('absensi_attendances', JSON.stringify(attendances));
    return data;
}

function updateAttendance(id, data) {
    const attendances = getAttendances();
    const index = attendances.findIndex(a => a.id === id);
    if (index === -1) return null;
    attendances[index] = { ...attendances[index], ...data };
    localStorage.setItem('absensi_attendances', JSON.stringify(attendances));
    return attendances[index];
}

// ============================================
// LEAVE MANAGEMENT
// ============================================

function getLeaves() {
    return JSON.parse(localStorage.getItem('absensi_leaves') || '[]');
}

function getLeavesByUserId(userId) {
    return getLeaves().filter(l => l.userId === userId);
}

function getPendingLeaves() {
    return getLeaves().filter(l => l.status === 'pending');
}

function addLeave(data) {
    const leaves = getLeaves();
    leaves.push(data);
    localStorage.setItem('absensi_leaves', JSON.stringify(leaves));
    return data;
}

function updateLeave(id, data) {
    const leaves = getLeaves();
    const index = leaves.findIndex(l => l.id === id);
    if (index === -1) return null;
    leaves[index] = { ...leaves[index], ...data };
    localStorage.setItem('absensi_leaves', JSON.stringify(leaves));
    return leaves[index];
}

// ============================================
// QR CODE MANAGEMENT (Auto Refresh 5 detik)
// ============================================

function getQRCodes() {
    return JSON.parse(localStorage.getItem('absensi_qrcodes') || '[]');
}

function getActiveQR() {
    const qrcodes = getQRCodes();
    const now = new Date();
    
    // Get QR created in last 10 seconds
    return qrcodes
        .filter(qr => {
            const created = new Date(qr.createdAt);
            return (now - created) < 10000;
        })
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0] || null;
}

function generateQR(expiredMinutes = 0) {
    const qrcodes = getQRCodes();
    
    const timestamp = Date.now();
    const random = generateRandomString(32);
    const code = `ABSENSI_${timestamp}_${random}`;
    
    const now = new Date();
    const expiredAt = expiredMinutes > 0 
        ? new Date(now.getTime() + expiredMinutes * 60000)
        : new Date(now.getTime() + 10000); // 10 seconds for auto-refresh
    
    const qrData = {
        id: timestamp,
        code,
        createdAt: now.toISOString(),
        expiredAt: expiredAt.toISOString(),
        usedBy: []
    };
    
    // Keep only last 50 QR codes
    const recentQRs = qrcodes.slice(-49);
    recentQRs.push(qrData);
    localStorage.setItem('absensi_qrcodes', JSON.stringify(recentQRs));
    
    return qrData;
}

function validateQR(code) {
    const qrcodes = getQRCodes();
    const qrData = qrcodes.find(qr => qr.code === code);
    
    if (!qrData) {
        return { valid: false, message: 'QR Code tidak valid atau sudah kadaluarsa.' };
    }
    
    const now = new Date();
    const created = new Date(qrData.createdAt);
    const age = now - created;
    
    // QR valid for 15 seconds (buffer for scan time)
    if (age > 15000) {
        return { valid: false, message: 'QR Code sudah kadaluarsa. Silakan scan yang terbaru.' };
    }
    
    return { valid: true, qrData };
}

function markQRAsUsed(code, userId) {
    const qrcodes = getQRCodes();
    const index = qrcodes.findIndex(qr => qr.code === code);
    if (index === -1) return false;
    
    if (!qrcodes[index].usedBy) qrcodes[index].usedBy = [];
    qrcodes[index].usedBy.push(userId);
    localStorage.setItem('absensi_qrcodes', JSON.stringify(qrcodes));
    return true;
}

// ============================================
// SETTINGS
// ============================================

function getSettings() {
    return JSON.parse(localStorage.getItem('absensi_settings') || '{}');
}

function getSetting(key) {
    return getSettings()[key] || null;
}

function updateSetting(key, value) {
    const settings = getSettings();
    settings[key] = value;
    localStorage.setItem('absensi_settings', JSON.stringify(settings));
    return settings;
}

// ============================================
// UTILITY
// ============================================

function generateRandomString(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}