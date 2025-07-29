import authService from '../services/authService';

export default class Navbar {
    constructor(onNavigate, currentUser) {
        this.onNavigate = onNavigate;
        this.currentUser = currentUser;
        this.element = this.createElement();
    }

    createElement() {
        const nav = document.createElement('nav');
        nav.className = 'bg-white shadow-lg mb-6';
        nav.innerHTML = `
            <div class="max-w-7xl mx-auto px-4">
                <div class="flex justify-between h-16">
                    <div class="flex items-center">
                        <h1 class="text-2xl font-bold text-blue-600 cursor-pointer" data-action="home">GittiAI</h1>
                    </div>
                    <div class="flex items-center space-x-4">
                        ${this.currentUser ? `
                            <span class="text-gray-700">Привет, ${this.currentUser.email}</span>
                            <button class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded" data-action="history">
                                История
                            </button>
                            <button class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded" data-action="logout">
                                Выйти
                            </button>
                        ` : `
                            <button class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded" data-action="login">
                                Войти
                            </button>
                        `}
                    </div>
                </div>
            </div>
        `;

        nav.addEventListener('click', (e) => {
            const action = e.target.dataset.action;
            if (action) {
                if (action === 'logout') {
                    authService.logout();
                } else {
                    this.onNavigate(action);
                }
            }
        });

        return nav;
    }

    update(currentUser) {
        this.currentUser = currentUser;
        this.element.remove();
        this.element = this.createElement();
        document.body.insertBefore(this.element, document.body.firstChild);
    }
}
