import Navbar from './components/Navbar';
import Auth from './components/Auth';
import Chat from './components/Chat';
import History from './components/History';
import authService from './services/authService';
import { auth } from './services/authService'; // Импортируем auth

export default class App {
    constructor() {
        this.currentUser = null;
        this.currentView = 'auth';
        this.navbar = new Navbar(this.handleNavigation.bind(this), this.currentUser);
        this.initializeApp();
    }

    initializeApp() {
        document.body.appendChild(this.navbar.element);
        this.updateView();
        
        // Следим за изменением состояния аутентификации
        // Проверяем, что auth существует перед использованием
        if (auth && auth.onAuthStateChanged) {
            auth.onAuthStateChanged((user) => {
                this.currentUser = user;
                this.navbar.update(user);
                this.updateView();
            });
        } else {
            // Демо-режим без Firebase
            console.log("Running in demo mode without Firebase");
            this.currentUser = null; // Или установите демо-пользователя
            this.updateView();
        }
    }

    updateView() {
        const appContainer = document.getElementById('app');
        appContainer.innerHTML = '';

        if (!this.currentUser) {
            this.currentView = 'auth';
            const authComponent = new Auth(() => {
                // После успешной авторизации обновим представление
                setTimeout(() => this.updateView(), 100);
            });
            appContainer.appendChild(authComponent.element);
        } else {
            switch (this.currentView) {
                case 'history':
                    const history = new History(this.handleSelectChat.bind(this));
                    appContainer.appendChild(history.element);
                    break;
                case 'chat':
                default:
                    const chat = new Chat();
                    appContainer.appendChild(chat.element);
                    break;
            }
        }
    }

    handleNavigation(view) {
        this.currentView = view;
        this.updateView();
    }

    handleSelectChat(chatItem) {
        this.currentView = 'chat';
        this.updateView();
        // Здесь можно добавить логику для отображения выбранного чата
    }
}
