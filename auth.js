document.addEventListener('DOMContentLoaded', function() {
    // Toggle between Login & Signup forms
    const loginTab = document.getElementById('loginTab');
    const signupTab = document.getElementById('signupTab');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const switchToSignup = document.getElementById('switchToSignup');
    const switchToLogin = document.getElementById('switchToLogin');

    function showLogin() {
        loginTab.classList.add('active');
        signupTab.classList.remove('active');
        loginForm.classList.add('active');
        signupForm.classList.remove('active');
    }

    function showSignup() {
        signupTab.classList.add('active');
        loginTab.classList.remove('active');
        signupForm.classList.add('active');
        loginForm.classList.remove('active');
    }

    loginTab.addEventListener('click', showLogin);
    signupTab.addEventListener('click', showSignup);
    switchToSignup.addEventListener('click', showSignup);
    switchToLogin.addEventListener('click', showLogin);

    // Password visibility toggle
    window.togglePassword = function(inputId, icon) {
        const input = document.getElementById(inputId);
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    };

    // Password strength meter
    const passwordInput = document.getElementById('signupPassword');
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text');

    passwordInput.addEventListener('input', function() {
        const password = this.value;
        const strength = calculatePasswordStrength(password);
        
        strengthBar.style.width = strength.percentage + '%';
        strengthBar.style.backgroundColor = strength.color;
        strengthText.textContent = strength.text;
        strengthText.style.color = strength.color;
    });

    function calculatePasswordStrength(password) {
        let strength = 0;
        
        // Length check
        if (password.length >= 8) strength += 1;
        if (password.length >= 12) strength += 1;
        
        // Character diversity
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;
        
        // Determine strength level
        if (password.length === 0) {
            return {
                percentage: 0,
                color: 'transparent',
                text: ''
            };
        } else if (strength <= 2) {
            return {
                percentage: 33,
                color: '#e74c3c',
                text: 'Weak'
            };
        } else if (strength <= 4) {
            return {
                percentage: 66,
                color: '#f39c12',
                text: 'Medium'
            };
        } else {
            return {
                percentage: 100,
                color: '#2ecc71',
                text: 'Strong'
            };
        }
    }

    // Form validation & submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        // Simulate login (replace with actual API call)
        console.log('Login attempt:', { email, password });
        alert('Login successful! Redirecting...');
        // window.location.href = 'dashboard.html';
    });

    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('signupConfirmPassword').value;
        
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        
        if (!document.getElementById('agreeTerms').checked) {
            alert('You must agree to the terms and conditions');
            return;
        }
        
        // Simulate signup (replace with actual API call)
        console.log('Signup attempt:', { name, email, password });
        alert('Account created successfully! Redirecting...');
        // window.location.href = 'dashboard.html';
    });

    // Social login buttons (simulated)
    document.querySelectorAll('.btn-google, .btn-facebook').forEach(btn => {
        btn.addEventListener('click', function() {
            alert(`Redirecting to ${this.textContent.trim()} authentication...`);
            // Actual implementation would redirect to OAuth provider
        });
    });
});