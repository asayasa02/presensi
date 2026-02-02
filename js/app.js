/**
 * App.js - Utility Functions
 * Helper functions used across the application
 */

// ============================================
// DATE & TIME FORMATTING
// ============================================

function formatDate(date) {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    
    const d = date instanceof Date ? date : new Date(date);
    return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function formatTime(time) {
    if (time instanceof Date) {
        return time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    }
    return time;
}

function formatDateTime(datetime) {
    const d = datetime instanceof Date ? datetime : new Date(datetime);
    return `${formatDate(d)} ${formatTime(d)}`;
}

function getGreeting() {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 11) {
        return 'Selamat Pagi! ☀️';
    } else if (hour >= 11 && hour < 15) {
        return 'Selamat Siang! 🌤️';
    } else if (hour >= 15 && hour < 18) {
        return 'Selamat Sore! 🌅';
    } else {
        return 'Selamat Malam! 🌙';
    }
}

function timeAgo(date) {
    const now = new Date();
    const d = date instanceof Date ? date : new Date(date);
    const diff = now - d;
    
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    
    if (seconds < 60) return 'Baru saja';
    if (minutes < 60) return `${minutes} menit lalu`;
    if (hours < 24) return `${hours} jam lalu`;
    if (days < 7) return `${days} hari lalu`;
    if (weeks < 4) return `${weeks} minggu lalu`;
    return `${months} bulan lalu`;
}

// ============================================
// VALIDATION
// ============================================

function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function validatePhone(phone) {
    const regex = /^(\+62|62|0)8[1-9][0-9]{7,11}$/;
    return regex.test(phone.replace(/[\s-]/g, ''));
}

// ============================================
// ALERTS & NOTIFICATIONS
// ============================================

function showAlert(type, title, message) {
    return Swal.fire({
        icon: type,
        title: title,
        text: message,
        confirmButtonColor: '#4f46e5'
    });
}

function showConfirm(title, message) {
    return Swal.fire({
        title: title,
        text: message,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#4f46e5',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Ya',
        cancelButtonText: 'Batal'
    });
}

function showLoading() {
    Swal.fire({
        title: 'Memproses...',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => Swal.showLoading()
    });
}

function hideLoading() {
    Swal.close();
}

function showToast(type, message) {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
    });
    
    Toast.fire({ icon: type, title: message });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function truncate(text, length = 50) {
    if (!text) return '';
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
}

function capitalize(string) {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getInitials(name) {
    if (!name) return '';
    return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();
}

function isToday(date) {
    const today = new Date();
    const d = date instanceof Date ? date : new Date(date);
    return d.toDateString() === today.toDateString();
}

function isWeekend(date) {
    const d = date instanceof Date ? date : new Date(date);
    const day = d.getDay();
    return day === 0 || day === 6;
}

function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

function getWorkingDaysInMonth(year, month) {
    const days = getDaysInMonth(year, month);
    let workingDays = 0;
    
    for (let d = 1; d <= days; d++) {
        const day = new Date(year, month, d).getDay();
        if (day !== 0) workingDays++; // Exclude Sunday
    }
    
    return workingDays;
}

// ============================================
// EXPORT DATA
// ============================================

function downloadJSON(data, filename) {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function exportAttendanceCSV(month, year) {
    const attendances = getAttendances().filter(a => {
        const date = new Date(a.tanggal);
        return date.getMonth() === month && date.getFullYear() === year;
    });
    
    const headers = ['Tanggal', 'Nama', 'NIP', 'Jam Masuk', 'Status', 'Validasi'];
    const rows = attendances.map(a => {
        const user = getUserById(a.userId);
        return [
            a.tanggal,
            user ? user.nama : '-',
            user ? user.nip : '-',
            a.jamMasuk,
            a.status,
            a.validated ? 'Ya' : 'Tidak'
        ];
    });
    
    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
        csv += row.map(cell => `"${cell}"`).join(',') + '\n';
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `laporan-kehadiran-${year}-${month + 1}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showToast('success', 'Berhasil disalin!');
    } catch (err) {
        showToast('error', 'Gagal menyalin!');
    }
}

// ============================================
// DOM HELPERS
// ============================================

function createElement(tag, attrs = {}, children = []) {
    const el = document.createElement(tag);
    
    Object.entries(attrs).forEach(([key, value]) => {
        if (key === 'className') {
            el.className = value;
        } else if (key === 'style' && typeof value === 'object') {
            Object.assign(el.style, value);
        } else if (key.startsWith('on') && typeof value === 'function') {
            el.addEventListener(key.substring(2).toLowerCase(), value);
        } else {
            el.setAttribute(key, value);
        }
    });
    
    if (typeof children === 'string') {
        el.textContent = children;
    } else if (children instanceof HTMLElement) {
        el.appendChild(children);
    } else if (Array.isArray(children)) {
        children.forEach(child => {
            if (typeof child === 'string') {
                el.appendChild(document.createTextNode(child));
            } else if (child instanceof HTMLElement) {
                el.appendChild(child);
            }
        });
    }
    
    return el;
}

function $(selector) {
    return document.querySelector(selector);
}

function $$(selector) {
    return document.querySelectorAll(selector);
}

function addEventListenerAll(selector, event, handler) {
    document.querySelectorAll(selector).forEach(el => {
        el.addEventListener(event, handler);
    });
}

// ============================================
// LOCAL STORAGE HELPERS
// ============================================

function safeJSONParse(json, defaultValue = null) {
    try {
        return JSON.parse(json);
    } catch (e) {
        return defaultValue;
    }
}

function getLocalStorageSize() {
    let total = 0;
    for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            total += localStorage[key].length * 2;
        }
    }
    
    if (total > 1024 * 1024) {
        return (total / (1024 * 1024)).toFixed(2) + ' MB';
    }
    return (total / 1024).toFixed(2) + ' KB';
}

// ============================================
// MOBILE DETECTION
// ============================================

function isMobile() {
    return window.innerWidth < 768;
}

function isTablet() {
    return window.innerWidth >= 768 && window.innerWidth < 1024;
}

function isDesktop() {
    return window.innerWidth >= 1024;
}

function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

// ============================================
// NETWORK STATUS
// ============================================

function isOnline() {
    return navigator.onLine;
}

function onNetworkChange(callback) {
    window.addEventListener('online', () => callback(true));
    window.addEventListener('offline', () => callback(false));
}

// ============================================
// FULLSCREEN API
// ============================================

function requestFullscreen(element) {
    if (element.requestFullscreen) {
        return element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
        return element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
        return element.msRequestFullscreen();
    }
    return Promise.reject('Fullscreen not supported');
}

function exitFullscreen() {
    if (document.exitFullscreen) {
        return document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        return document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        return document.msExitFullscreen();
    }
    return Promise.reject('Exit fullscreen not supported');
}

function isFullscreen() {
    return !!(document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement);
}

// ============================================
// VIBRATION API (for mobile feedback)
// ============================================

function vibrate(pattern = 50) {
    if ('vibrate' in navigator) {
        navigator.vibrate(pattern);
    }
}

// ============================================
// DATE HELPERS
// ============================================

function getMonthName(month) {
    const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    return months[month];
}

function getDayName(day) {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    return days[day];
}

function getShortMonthName(month) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    return months[month];
}

function getShortDayName(day) {
    const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    return days[day];
}

function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

function subtractDays(date, days) {
    return addDays(date, -days);
}

function getStartOfWeek(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
}

function getEndOfWeek(date) {
    const start = getStartOfWeek(date);
    return addDays(start, 6);
}

function getStartOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

function getEndOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function isSameDay(date1, date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return d1.toDateString() === d2.toDateString();
}

function isBefore(date1, date2) {
    return new Date(date1) < new Date(date2);
}

function isAfter(date1, date2) {
    return new Date(date1) > new Date(date2);
}

function diffInDays(date1, date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2 - d1);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function diffInHours(date1, date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2 - d1);
    return Math.ceil(diffTime / (1000 * 60 * 60));
}

function diffInMinutes(date1, date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2 - d1);
    return Math.ceil(diffTime / (1000 * 60));
}

// ============================================
// COLOR HELPERS
// ============================================

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function rgbToHex(r, g, b) {
    return "#" + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    }).join("");
}

// ============================================
// RANDOM HELPERS
// ============================================

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

function randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// ============================================
// STRING HELPERS
// ============================================

function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-');
}

function camelCase(str) {
    return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

function kebabCase(str) {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

function unescapeHtml(text) {
    const map = {
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#039;': "'"
    };
    return text.replace(/&amp;|&lt;|&gt;|&quot;|&#039;/g, m => map[m]);
}

// ============================================
// ARRAY HELPERS
// ============================================

function unique(array) {
    return [...new Set(array)];
}

function groupBy(array, key) {
    return array.reduce((result, item) => {
        const groupKey = typeof key === 'function' ? key(item) : item[key];
        if (!result[groupKey]) result[groupKey] = [];
        result[groupKey].push(item);
        return result;
    }, {});
}

function sortBy(array, key, order = 'asc') {
    return [...array].sort((a, b) => {
        const valA = typeof key === 'function' ? key(a) : a[key];
        const valB = typeof key === 'function' ? key(b) : b[key];
        
        if (valA < valB) return order === 'asc' ? -1 : 1;
        if (valA > valB) return order === 'asc' ? 1 : -1;
        return 0;
    });
}

function chunk(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
}

function flatten(array) {
    return array.reduce((flat, toFlatten) => {
        return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
    }, []);
}

// ============================================
// OBJECT HELPERS
// ============================================

function isEmpty(obj) {
    if (obj === null || obj === undefined) return true;
    if (typeof obj === 'string' || Array.isArray(obj)) return obj.length === 0;
    if (typeof obj === 'object') return Object.keys(obj).length === 0;
    return false;
}

function pick(obj, keys) {
    return keys.reduce((result, key) => {
        if (obj.hasOwnProperty(key)) {
            result[key] = obj[key];
        }
        return result;
    }, {});
}

function omit(obj, keys) {
    return Object.keys(obj).reduce((result, key) => {
        if (!keys.includes(key)) {
            result[key] = obj[key];
        }
        return result;
    }, {});
}

function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function merge(target, ...sources) {
    return Object.assign({}, target, ...sources);
}

function deepMerge(target, source) {
    const output = { ...target };
    
    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach(key => {
            if (isObject(source[key])) {
                if (!(key in target)) {
                    output[key] = source[key];
                } else {
                    output[key] = deepMerge(target[key], source[key]);
                }
            } else {
                output[key] = source[key];
            }
        });
    }
    
    return output;
}

function isObject(item) {
    return item && typeof item === 'object' && !Array.isArray(item);
}

// ============================================
// URL HELPERS
// ============================================

function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    const result = {};
    for (const [key, value] of params) {
        result[key] = value;
    }
    return result;
}

function getQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
}

function setQueryParam(name, value) {
    const url = new URL(window.location);
    url.searchParams.set(name, value);
    window.history.pushState({}, '', url);
}

function removeQueryParam(name) {
    const url = new URL(window.location);
    url.searchParams.delete(name);
    window.history.pushState({}, '', url);
}

// ============================================
// CONSOLE HELPERS (for development)
// ============================================

function log(...args) {
    console.log('[Absensi]', ...args);
}

function warn(...args) {
    console.warn('[Absensi]', ...args);
}

function error(...args) {
    console.error('[Absensi]', ...args);
}

function table(data) {
    console.table(data);
}

function time(label) {
    console.time(label);
}

function timeEnd(label) {
    console.timeEnd(label);
}