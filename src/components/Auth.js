import authService from '../services/authService';

export default class Auth {
    constructor(onAuthSuccess) {
        this.onAuthSuccess = onAuthSuccess;
        this.element = this.createElement();
    }

    createElement() {
        const div = document.createElement('div');
        div.className = 'auth-container';
        div.innerHTML = `
            <h2 class="text-2xl font-bold text-center mb-6">Вход в GittiAI</h2>
            
            <div class="mb-4">
                <button id="google-login" class="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded flex items-center justify-center">
                    <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Войти через Google
                </button>
            </div>

            <div class="relative my-6">
                <div class="absolute inset-0 flex items-center">
                    <div class="w-full border-t border-gray-300"></div>
                </div>
                <div class="relative flex justify-center text-sm">
                    <span class="px-2 bg-white text-gray-500">или</span>
                </div>
            </div>

            <form id="email-auth-form">
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
                        Email
                    </label>
                    <input type="email" id="email" required
                           class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                
                <div class="mb-6">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
                        Пароль
                    </label>
                    <input type="password" id="password" required
                           class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                
                <div class="flex items-center justify-between mb-4">
                    <button type="button" id="signup-btn" class="text-blue-500 hover:text-blue-700 text-sm">
                        Создать аккаунт
                    </button>
                    <button type="submit" id="login-btn" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                        Войти
                    </button>
                </div>
            </form>

            <div id="auth-error" class="hidden text-red-500 text-sm mt-2"></div>
        `;

        this.bindEvents(div);
        return div;
    }

    bindEvents(element) {
        const googleLoginBtn = element.querySelector('#google-login');
        const emailForm = element.querySelector('#email-auth-form');
        const signupBtn = element.querySelector('#signup-btn');
        const errorDiv = element.querySelector('#auth-error');

        googleLoginBtn.addEventListener('click', async () => {
            try {
                await authService.signInWithGoogle();
                this.onAuthSuccess();
            } catch (error) {
                this.showError(errorDiv, 'Ошибка входа через Google');
            }
        });

        emailForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = element.querySelector('#email').value;
            const password = element.querySelector('#password').value;
            
            try {
                await authService.signInWithEmail(email, password);
                this.onAuthSuccess();
            } catch (error) {
                this.showError(errorDiv, 'Неверный email или пароль');
            }
        });

        signupBtn.addEventListener('click', async () => {
            const email = element.querySelector('#email').value;
            const password = element.querySelector('#password').value;
            
            if (!email || !password) {
                this.showError(errorDiv, 'Введите email и пароль');
                return;
            }

            try {
                await authService.signUpWithEmail(email, password);
                this.onAuthSuccess();
            } catch (error) {
                this.showError(errorDiv, 'Ошибка создания аккаунта');
            }
        });
    }

    showError(errorDiv, message) {
        errorDiv.textContent = message;
        errorDiv.classList.remove('hidden');
        setTimeout(() => {
            errorDiv.classList.add('hidden');
        }, 3000);
    }
}
