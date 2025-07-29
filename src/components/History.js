import firestoreService from '../services/firestoreService';
import { auth } from '../services/authService';

export default class History {
    constructor(onSelectChat) {
        this.onSelectChat = onSelectChat;
        this.history = [];
        this.element = this.createElement();
        this.loadHistory();
    }

    createElement() {
        const div = document.createElement('div');
        div.className = 'max-w-4xl mx-auto p-4';
        div.innerHTML = `
            <div class="bg-white rounded-lg shadow-lg">
                <div class="p-4 border-b border-gray-200">
                    <h2 class="text-xl font-bold">История чатов</h2>
                </div>
                <div id="history-list" class="divide-y divide-gray-200">
                    <div class="p-8 text-center text-gray-500">
                        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
                        <p>Загрузка истории...</p>
                    </div>
                </div>
            </div>
        `;
        return div;
    }

    async loadHistory() {
        try {
            const user = auth.currentUser;
            if (!user) return;

            this.history = await firestoreService.getChatHistory(user.uid);
            this.renderHistory();
        } catch (error) {
            console.error('Error loading history:', error);
            this.renderError();
        }
    }

    renderHistory() {
        const list = this.element.querySelector('#history-list');
        
        if (this.history.length === 0) {
            list.innerHTML = `
                <div class="p-8 text-center text-gray-500">
                    <p>История чатов пуста</p>
                </div>
            `;
            return;
        }

        list.innerHTML = this.history.map(item => `
            <div class="history-item" data-id="${item.id}">
                <div class="font-semibold truncate">${item.message}</div>
                <div class="text-sm text-gray-600 mt-1 truncate">${item.response}</div>
                <div class="text-xs text-gray-400 mt-2">
                    ${item.timestamp ? new Date(item.timestamp.toDate()).toLocaleString('ru-RU') : 'Только что'}
                </div>
            </div>
        `).join('');

        list.addEventListener('click', (e) => {
            const item = e.target.closest('.history-item');
            if (item) {
                const historyItem = this.history.find(h => h.id === item.dataset.id);
                if (historyItem) {
                    this.onSelectChat(historyItem);
                }
            }
        });
    }

    renderError() {
        const list = this.element.querySelector('#history-list');
        list.innerHTML = `
            <div class="p-8 text-center text-red-500">
                <p>Ошибка загрузки истории</p>
            </div>
        `;
    }
}
