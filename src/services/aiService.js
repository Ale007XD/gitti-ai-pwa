class AIService {
    constructor() {
        this.apiUrl = 'https://freegpt-api.vercel.app/api/generate';
    }

    async generateResponse(prompt) {
        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.response || data.text || 'Извините, не удалось получить ответ.';
        } catch (error) {
            console.error('AI Service Error:', error);
            throw new Error('Не удалось получить ответ от AI. Попробуйте позже.');
        }
    }
}

export default new AIService();
