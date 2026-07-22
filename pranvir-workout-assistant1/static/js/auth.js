// Authentication functionality
class AuthManager {
    constructor() {
        this.init();
    }

    init() {
        this.initializeLoginForm();
        this.initializeFormValidation();
        this.initializeRememberMe();
    }

    initializeLoginForm() {
        const loginForm = document.querySelector('.login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', this.handleLogin.bind(this));
        }
    }

    initializeFormValidation() {
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');

        if (emailInput) {
            emailInput.addEventListener('blur', this.validateEmail.bind(this));
        }

        if (passwordInput) {
            passwordInput.addEventListener('blur', this.validatePassword.bind(this));
            passwordInput.addEventListener('input', this.validatePasswordStrength.bind(this));
        }
    }

    initializeRememberMe() {
        const rememberCheckbox = document.querySelector('input[name="remember"]');
        if (rememberCheckbox && localStorage.getItem('rememberedEmail')) {
            rememberCheckbox.checked = true;
            document.getElementById('email').value = localStorage.getItem('rememberedEmail');
        }
    }

    handleLogin(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');
        const remember = formData.get('remember');

        // Validate form
        if (!this.validateForm(email, password)) {
            return;
        }

        // Show loading state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        this.setLoadingState(submitBtn, true);

        // Simulate API call (replace with actual authentication)
        this.authenticateUser(email, password, remember)
            .then(() => {
                this.setLoadingState(submitBtn, false);
                // Redirect happens via form submission to Flask
            })
            .catch(error => {
                this.setLoadingState(submitBtn, false);
                this.showError(error.message);
            });
    }

    async authenticateUser(email, password, remember) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Basic validation (replace with actual authentication)
        if (!email || !password) {
            throw new Error('Please enter both email and password');
        }

        if (!this.isValidEmail(email)) {
            throw new Error('Please enter a valid email address');
        }

        // Store remembered email
        if (remember) {
            localStorage.setItem('rememberedEmail', email);
        } else {
            localStorage.removeItem('rememberedEmail');
        }

        return { success: true };
    }

    validateForm(email, password) {
        let isValid = true;

        if (!this.validateEmail(email)) {
            isValid = false;
        }

        if (!this.validatePassword(password)) {
            isValid = false;
        }

        return isValid;
    }

    validateEmail(email) {
        const emailInput = document.getElementById('email');
        const emailError = this.getOrCreateErrorElement(emailInput);

        if (!email) {
            this.showFieldError(emailInput, emailError, 'Email is required');
            return false;
        }

        if (!this.isValidEmail(email)) {
            this.showFieldError(emailInput, emailError, 'Please enter a valid email address');
            return false;
        }

        this.clearFieldError(emailInput, emailError);
        return true;
    }

    validatePassword(password) {
        const passwordInput = document.getElementById('password');
        const passwordError = this.getOrCreateErrorElement(passwordInput);

        if (!password) {
            this.showFieldError(passwordInput, passwordError, 'Password is required');
            return false;
        }

        if (password.length < 6) {
            this.showFieldError(passwordInput, passwordError, 'Password must be at least 6 characters');
            return false;
        }

        this.clearFieldError(passwordInput, passwordError);
        return true;
    }

    validatePasswordStrength(password) {
        const strengthMeter = document.getElementById('password-strength');
        if (!strengthMeter) return;

        const strength = this.calculatePasswordStrength(password);
        strengthMeter.className = `password-strength strength-${strength.level}`;
        strengthMeter.textContent = strength.text;
    }

    calculatePasswordStrength(password) {
        if (!password) return { level: 0, text: '' };

        let score = 0;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        const levels = [
            { level: 0, text: 'Very Weak' },
            { level: 1, text: 'Weak' },
            { level: 2, text: 'Fair' },
            { level: 3, text: 'Good' },
            { level: 4, text: 'Strong' }
        ];

        return levels[Math.min(score, 4)];
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    getOrCreateErrorElement(input) {
        let errorElement = input.parentNode.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            input.parentNode.appendChild(errorElement);
        }
        return errorElement;
    }

    showFieldError(input, errorElement, message) {
        input.classList.add('error');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    clearFieldError(input, errorElement) {
        input.classList.remove('error');
        errorElement.style.display = 'none';
    }

    setLoadingState(button, isLoading) {
        if (isLoading) {
            button.disabled = true;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
        } else {
            button.disabled = false;
            button.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign In';
        }
    }

    showError(message) {
        // Remove existing errors
        const existingErrors = document.querySelectorAll('.error-message');
        existingErrors.forEach(error => error.remove());

        // Create new error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            ${message}
        `;

        const loginCard = document.querySelector('.login-card');
        loginCard.insertBefore(errorDiv, loginCard.firstChild);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }

    // Utility method for other auth operations
    static checkAuthStatus() {
        return fetch('/api/auth/status')
            .then(response => response.json())
            .catch(() => ({ authenticated: false }));
    }

    static logout() {
        return fetch('/api/auth/logout', { method: 'POST' })
            .then(() => {
                window.location.href = '/';
            });
    }
}

// Initialize auth manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new AuthManager();
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthManager;
}