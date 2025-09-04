export class Chatbot {
    private container: HTMLElement | null = null;
    private chatMessages: HTMLElement | null = null;
    private chatInput: HTMLInputElement | null = null;
    private floatingBtn: HTMLElement | null = null;
    private isOpen: boolean = false;

    private knowledgeBase = {
        categories: {
            keywords: ['categories', 'category', 'competition', 'events', 'types'],
            response: `🏆 **DS Venturists 2025 Competition Categories:**

📋 **Dealer's Den** - Pitch innovative business ideas addressing SDGs with clear profitability paths

🎨 **AdMania** - Create compelling 90-second promotional videos for SDG-aligned products/services

🧠 **Business Buzz** - High-intensity rapid-fire rounds testing business knowledge and current affairs

🔧 **Product Reboot** - Transform failed/outdated products into successful business ventures

Each category challenges different skills - from entrepreneurship to creativity to strategic thinking!`
        },
        registration: {
            keywords: ['register', 'registration', 'sign up', 'join', 'participate', 'how to register'],
            response: `✍️ **Registration Information:**

📅 **Event Date:** October 4th, 2025
🗓️ **Registration Deadline:** September 20th, 2025

📋 **Eligibility:**
• Years 9-13 (Grades 8-12) students
• Must be studying in the UAE
• Teams of 2-4 members from the same school
• Must have a designated teacher supervisor

🔗 **Register Now:** [Click here to register](https://docs.google.com/forms/d/e/1FAIpQLSc5NGnvaQ_EXwXueajSoWSUS4PSoVpj5ifFZrJZo2jYSuO2dQ/viewform)

⚡ **Limited spots available - register early!**`
        },
        theme: {
            keywords: ['theme', '2025', 'profit with purpose', 'business value'],
            response: `🎯 **2025 Theme: "Redefining Business Value: Profit with Purpose"**

This year's theme challenges participants to reimagine the fundamental purpose of business in our modern world. We're moving beyond traditional profit-first thinking to explore how organizations can create sustainable value for both shareholders and society.

💡 **Key Focus Areas:**
• Innovation with measurable impact
• Stakeholder value creation
• Sustainable growth models
• Future-ready solutions
• Strategic excellence

🌍 **Questions to Consider:**
• How can technology drive both profit and purpose?
• What does success look like beyond financial metrics?
• How do you measure and communicate impact?`
        },
        date: {
            keywords: ['when', 'date', 'time', 'schedule', 'event date'],
            response: `📅 **Important Dates:**

🏆 **Competition Date:** October 4th, 2025
📝 **Registration Deadline:** September 20th, 2025

⏰ The competition will be a full-day event with multiple rounds across all categories. Detailed schedule will be shared closer to the event date.

📍 Location details will be provided to registered participants.`
        },
        team: {
            keywords: ['team', 'organizers', 'who', 'contact', 'leadership'],
            response: `👥 **Meet the DS Venturists Leadership Team:**

🎖️ **President:** Reyaansh Dugad
💻 **Chief Tech Strategist:** Mahin Kashyap  
📢 **Head of PR:** Samara Deshnoor
⚙️ **Head of Operations:** Tanisha Khanna
📦 **Head of Logistics:** Vishaka Nankani
📈 **Head of Marketing:** Hardik Kumar
🎨 **Creative Director:** Zaheera Raj

📧 **Contact Us:** identity@dubaischolars.com
📱 **Follow Us:** @dsident1ty on Instagram`
        },
        judges: {
            keywords: ['judges', 'sponsors', 'panel', 'judging', 'evaluation'],
            response: `🎭 **Judges & Sponsors:**

Our panel of judges and sponsors are currently under wraps! Industry titans, visionary leaders, and innovation masterminds have agreed to participate, but their identities remain classified for now.

🔒 **What We Can Tell You:**
• Experienced entrepreneurs and business leaders
• Industry experts across all competition categories
• Representatives from leading Dubai companies
• Innovation and sustainability specialists

🕒 The great revelation approaches... Stay tuned for the official announcement!`
        },
        prizes: {
            keywords: ['prizes', 'rewards', 'awards', 'win', 'trophy'],
            response: `🏆 **Prizes & Recognition:**

While specific prize details are still being finalized, participants can expect:

🥇 **Winner Recognition** across all categories
🏅 **Certificates** for all participants
🎁 **Valuable prizes** and potential opportunities
🤝 **Networking** with industry professionals
💼 **Mentorship** opportunities with experts

Prize details will be announced as we get closer to the competition date. The real value lies in the experience, skills, and connections you'll gain!`
        },
        location: {
            keywords: ['where', 'location', 'venue', 'address'],
            response: `📍 **Event Location:**

The exact venue will be shared with registered participants closer to the event date.

The competition will be held at a prestigious location in Dubai, easily accessible and equipped with all necessary facilities for a world-class entrepreneurship competition.

Register now to receive detailed location information and directions!`
        },
        help: {
            keywords: ['help', 'support', 'questions', 'assistance'],
            response: `🤖 **I'm here to help!** 

I can provide information about:
• 📋 Competition categories and rules  
• ✍️ Registration process and requirements
• 📅 Important dates and deadlines
• 🎯 This year's theme and focus areas
• 👥 Our amazing team
• 🏆 Prizes and recognition

Just ask me anything about DS Venturists 2025!

📧 For detailed inquiries: identity@dubaischolars.com`
        }
    };

    constructor() {
        this.init();
    }

    private init(): void {
        this.container = document.getElementById('chatbotContainer');
        this.chatMessages = document.getElementById('chatMessages');
        this.chatInput = document.getElementById('chatInput') as HTMLInputElement | null;
        this.floatingBtn = document.getElementById('chatbotFloatingBtn');

        if (!this.container || !this.chatMessages || !this.chatInput || !this.floatingBtn) {
            console.warn('Chatbot elements not found');
            return;
        }

        this.setupEventListeners();
        
        // Make toggle function available globally
        (window as any).toggleChatbot = () => this.toggleChatbot();
        (window as any).sendMessage = () => this.sendMessage();
        (window as any).sendQuickMessage = (message: string) => this.sendQuickMessage(message);
        (window as any).handleChatKeypress = (event: KeyboardEvent) => this.handleKeypress(event);
    }

    private setupEventListeners(): void {
        if (this.chatInput) {
            this.chatInput.addEventListener('keypress', (e) => this.handleKeypress(e));
        }
    }

    private toggleChatbot(): void {
        if (!this.container || !this.floatingBtn) return;
        
        this.isOpen = !this.isOpen;
        
        if (this.isOpen) {
            this.container.classList.add('open');
            this.floatingBtn.classList.add('hidden');
            if (this.chatInput) {
                setTimeout(() => this.chatInput?.focus(), 300);
            }
        } else {
            this.container.classList.remove('open');
            this.floatingBtn.classList.remove('hidden');
        }
    }

    private handleKeypress(event: KeyboardEvent): void {
        if (event.key === 'Enter') {
            this.sendMessage();
        }
    }

    private sendMessage(): void {
        if (!this.chatInput) return;
        
        const message = this.chatInput.value.trim();
        if (!message) return;

        this.addUserMessage(message);
        this.chatInput.value = '';

        // Simulate bot typing
        setTimeout(() => {
            const response = this.generateResponse(message);
            this.addBotMessage(response);
        }, 500);
    }

    private sendQuickMessage(message: string): void {
        this.addUserMessage(message);
        
        setTimeout(() => {
            const response = this.generateResponse(message);
            this.addBotMessage(response);
        }, 500);
    }

    private addUserMessage(message: string): void {
        if (!this.chatMessages) return;
        
        const messageElement = document.createElement('div');
        messageElement.className = 'message user-message';
        messageElement.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="message-content">
                <p>${message}</p>
            </div>
        `;
        
        this.chatMessages.appendChild(messageElement);
        this.scrollToBottom();
    }

    private addBotMessage(message: string): void {
        if (!this.chatMessages) return;
        
        const messageElement = document.createElement('div');
        messageElement.className = 'message bot-message';
        messageElement.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <p>${message.replace(/\n/g, '<br>')}</p>
            </div>
        `;
        
        this.chatMessages.appendChild(messageElement);
        this.scrollToBottom();
    }

    private generateResponse(userMessage: string): string {
        const message = userMessage.toLowerCase();
        
        // Find matching knowledge base entry
        for (const [, knowledge] of Object.entries(this.knowledgeBase)) {
            const hasKeyword = knowledge.keywords.some(keyword => 
                message.includes(keyword.toLowerCase())
            );
            
            if (hasKeyword) {
                return knowledge.response;
            }
        }

        // Default responses for unmatched queries
        const defaultResponses = [
            `🤔 I'd be happy to help! I can provide information about:
            
📋 Competition categories
✍️ Registration process  
📅 Important dates
🎯 This year's theme
👥 Our team
🏆 Prizes and recognition

What would you like to know more about?`,
            
            `💡 Great question! For specific details about DS Venturists 2025, try asking about:
            
• "What are the categories?"
• "How do I register?"
• "When is the event?"
• "What's the theme?"

📧 For detailed inquiries: identity@dubaischolars.com`,
            
            `🚀 DS Venturists 2025 is going to be amazing! 
            
Ask me about registration, categories, dates, or our theme "Profit with Purpose."

What specific information are you looking for?`
        ];
        
        const randomIndex = Math.floor(Math.random() * defaultResponses.length);
        return defaultResponses[randomIndex] || "I'm here to help! Ask me about DS Venturists 2025.";
    }

    private scrollToBottom(): void {
        if (this.chatMessages) {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Chatbot();
});
