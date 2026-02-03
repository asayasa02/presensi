<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="theme-color" content="#4f46e5">
    <meta name="description" content="Login - Aplikasi Absensi Guru">
    <title>Login - Absensi Guru</title>
    
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <link rel="stylesheet" href="css/style.css">
</head>
<body class="login-page">
    <div class="login-bg">
        <div class="login-pattern"></div>
    </div>
    
    <div class="login-container">
        <div class="login-card animate-fade-in">
            <div class="login-logo">
                <div class="login-logo-icon">
                    <i class="fas fa-school"></i>
                </div>
                <h1>Absensi Guru</h1>
                <p>SMP Negeri 1 Contoh</p>
            </div>
            
            <form id="loginForm" class="login-form">
                <div class="form-group">
                    <label class="form-label" for="email">Email</label>
                    <div class="form-input-icon">
                        <i class="fas fa-envelope"></i>
                        <input 
                            type="email" 
                            id="email" 
                            class="form-input" 
                            placeholder="Masukkan email"
                            required
                            autocomplete="email"
                        >
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label" for="password">Password</label>
                    <div class="form-input-icon">
                        <i class="fas fa-lock"></i>
                        <input 
                            type="password" 
                            id="password" 
                            class="form-input" 
                            placeholder="Masukkan password"
                            required
                            autocomplete="current-password"
                        >
                        <button type="button" class="password-toggle" id="togglePassword">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-checkbox">
                        <input type="checkbox" id="remember">
                        <span>Ingat saya</span>
                    </label>
                </div>
                
                <button type="submit" class="btn btn-primary btn-block" id="btnLogin">
                    <span class="btn-text">Masuk</span>
                    <span class="btn-loader" style="display: none;">
                        <i class="fas fa-spinner fa-spin"></i>
                    </span>
                </button>
            </form>
            
            <div class="demo-credentials">
                <p class="demo-title">Demo Credentials:</p>
                <div class="demo-item">
                    <span class="demo-role">Admin:</span>
                    <span>admin@sekolah.com / admin123</span>
                </div>
                <div class="demo-item">
                    <span class="demo-role">Guru:</span>
                    <span>ahmad@sekolah.com / guru123</span>
                </div>
            </div>
        </div>
    </div>
    
    <script src="js/storage.js"></script>
    <script src="js/app.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Initialize demo data
            initDemoData();
            
            // Check if already logged in
            const session = getSession();
            if (session) {
                redirectByRole(session.role);
            }
            
            // Toggle password visibility
            const togglePassword = document.getElementById('togglePassword');
            const passwordInput = document.getElementById('password');
            
            togglePassword.addEventListener('click', function() {
                const type = passwordInput.type === 'password' ? 'text' : 'password';
                passwordInput.type = type;
                this.querySelector('i').classList.toggle('fa-eye');
                this.querySelector('i').classList.toggle('fa-eye-slash');
            });
            
            // Form submit
            const loginForm = document.getElementById('loginForm');
            const btnLogin = document.getElementById('btnLogin');
            
            loginForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                const email = document.getElementById('email').value.trim();
                const password = document.getElementById('password').value;
                const remember = document.getElementById('remember').checked;
                
                // Show loading
                btnLogin.disabled = true;
                btnLogin.querySelector('.btn-text').style.display = 'none';
                btnLogin.querySelector('.btn-loader').style.display = 'inline-block';
                
                // Simulate network delay
                await new Promise(resolve => setTimeout(resolve, 800));
                
                // Authenticate
                const user = authenticateUser(email, password);
                
                if (user) {
                    saveSession(user, remember);
                    
                    await Swal.fire({
                        icon: 'success',
                        title: 'Login Berhasil!',
                        text: `Selamat datang, ${user.nama}`,
                        timer: 1500,
                        showConfirmButton: false
                    });
                    
                    redirectByRole(user.role);
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Login Gagal',
                        text: 'Email atau password salah!'
                    });
                    
                    btnLogin.disabled = false;
                    btnLogin.querySelector('.btn-text').style.display = 'inline-block';
                    btnLogin.querySelector('.btn-loader').style.display = 'none';
                }
            });
            
            function redirectByRole(role) {
                if (role === 'admin') {
                    window.location.href = 'admin/dashboard.html';
                } else {
                    window.location.href = 'guru/home.html';
                }
            }
        });
    </script>
</body>
</html>