import aiService from '../services/aiService';
import firestoreService from '../services/firestoreService';
import { auth } from '../services/authService';

export default class Chat {
    constructor() {
        this.messages = [];
        this.element = this.createElement();
        this.isLoading = false;
    }

    createElement() {
        const div = document.createElement('div');
        div.className = 'chat-container';
        div.innerHTML = `
            <div class="bg-white rounded-lg shadow-lg h-96 overflow-y-auto mb-4 p-4" id="chat-messages">
                <div class="text-center text-gray-500 py-8">
                    <p>Добро пожаловать в GittiAI! Задайте любой вопрос.</p>
                </div>
            </div>
            
            <form id="chat-form" class="flex gap-2">
                <input type="text" id="message-input" 
                       class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                       placeholder="Введите ваш вопрос..." required>
                <button type="submit" id="send-btn" 
                        class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium">
                    Отправить
                </button>
            </form>
            
            <div id="loading" class="hidden text-center text-gray-500 mt-4">
                <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                <span class="ml-2">AI думает...</span>
            </div>
        `;

        this.bindEvents(div);
        return div;
    }

    bindEvents(element) {
        const form = element.querySelector('#chat-form');
        const input = element.querySelector('#message-input');
        const messagesContainer = element.querySelector('#chat-messages');
        const loading = element.querySelector('#loading');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const message = input.value.trim();
            
            if (!message || this.isLoading) return;

            this.addMessage(message, 'user');
            input.value = '';
            
            this.isLoading = true;
            loading.classList.remove('hidden');
            
            try {
                const response = await aiService.generateResponse(message);
                this.addMessage(response, 'ai');
                
                // Сохраняем в историю
                const user = auth.currentUser;
                if (user) {
                    await firestoreService.saveMessage(message, response, user.uid);
                }
            } catch (error) {
                this.addMessage('Ошибка: ' + error.message, 'ai');
            } finally {
                this.isLoading = false;
                loading.classList.add('hidden');
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
        });
    }

    addMessage(content, sender) {
        const messagesContainer = this.element.querySelector('#chat-messages');
        
        // Убираем приветственное сообщение при первом сообщении
        if (this.messages.length === 0) {
            messagesContainer.innerHTML = '';
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender === 'user' ? 'user-message' : 'ai-message'}`;
        messageDiv.innerHTML = `
            <div class="font-semibold mb-1">${sender === 'user' ? 'Вы' : 'AI'}</div>
            <div>${this.formatMessage(content)}</div>
        `;

        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        this.messages.push({ content, sender });
    }

    formatMessage(text) {
        return text
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>');
    }
}
