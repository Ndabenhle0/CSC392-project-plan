document.addEventListener('DOMContentLoaded', function() {
    // =============================================
    // Mobile Menu Functionality
    // =============================================
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mainNav = document.querySelector('.main-nav');
    
    mobileMenuBtn.addEventListener('click', function() {
        mainNav.classList.toggle('active');
        this.querySelector('i').classList.toggle('fa-times');
        this.querySelector('i').classList.toggle('fa-bars');
    });

    // =============================================
    // Smooth Scrolling for Anchor Links
    // =============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                if (mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    mobileMenuBtn.querySelector('i').classList.remove('fa-times');
                    mobileMenuBtn.querySelector('i').classList.add('fa-bars');
                }
                
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // =============================================
    // Sticky Header on Scroll
    // =============================================
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 100) {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        }
    });

    // =============================================
    // Newsletter Form Handling
    // =============================================
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            if (emailInput.value) {
                alert('Thank you for subscribing to our newsletter!');
                emailInput.value = '';
            } else {
                alert('Please enter a valid email address.');
            }
        });
    }

    // =============================================
    // Login/Signup Button Functionality
    // =============================================
    const loginBtn = document.querySelector('.login-btn');
    const signupBtn = document.querySelector('.signup-btn');
    
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            window.location.href = 'login.html';
        });
    }
    
    if (signupBtn) {
        signupBtn.addEventListener('click', function() {
            window.location.href = 'login.html#signupForm';
        });
    }

    // =============================================
    // Enhanced Chatbot Functionality
    // =============================================
    const chatbotBtn = document.querySelector('.chatbot-btn');
    const chatbotContainer = document.createElement('div');
    chatbotContainer.className = 'chatbot-container';
    chatbotContainer.innerHTML = `
        <div class="chatbot-header">
            <h3>Transport Assistant</h3>
            <button class="close-chatbot"><i class="fas fa-times"></i></button>
        </div>
        <div class="chatbot-messages"></div>
        <div class="chatbot-input">
            <input type="text" placeholder="Ask about routes, tickets, or schedules..." id="chatbot-input-field">
            <button class="send-btn"><i class="fas fa-paper-plane"></i></button>
        </div>
    `;
    document.body.appendChild(chatbotContainer);
    
    // Chatbot State
    const chatbotState = {
        visible: false,
        messages: [
            {
                sender: 'bot',
                text: 'Hello! I can help you with:',
                quickReplies: ['Routes', 'Tickets', 'Tracking', 'Support']
            }
        ]
    };
    
    // Chatbot Knowledge Base
    const knowledgeBase = {
        'routes': {
            question: 'What would you like to know about routes?',
            options: ['Main routes', 'Regional routes', 'City routes', 'Schedule'],
            response: {
                'main routes': 'Our main routes connect major cities like Mbabane ↔ Manzini (45min journey, frequent service).',
                'regional routes': 'Regional routes include Mbabane ↔ Nhlangano (3h journey, 3 daily trips).',
                'city routes': 'City circular routes run every 20-30 minutes in Mbabane and Manzini.',
                'schedule': 'Weekday schedules start at 5:30 AM, with reduced service on weekends.'
            }
        },
        'tickets': {
            question: 'What would you like to know about tickets?',
            options: ['Types', 'Prices', 'How to buy', 'E-tickets'],
            response: {
                'types': 'We offer Standard (SZL 25), Premium (SZL 40), and Monthly Pass (SZL 450) tickets.',
                'prices': 'Prices range from SZL 25 for Standard to SZL 40 for Premium seats.',
                'how to buy': 'You can buy tickets online, at stations, or via mobile money.',
                'e-tickets': 'E-tickets with QR codes are available for all routes - scan when boarding.'
            }
        },
        'tracking': {
            question: 'What would you like to know about tracking?',
            options: ['Live tracker', 'ETA', 'Alerts', 'Notifications'],
            response: {
                'live tracker': 'Our live tracker shows real-time bus locations on the map.',
                'eta': 'Estimated arrival times update every 2 minutes based on current traffic.',
                'alerts': 'We notify about delays, cancellations, and route changes.',
                'notifications': 'You can subscribe to SMS/email alerts for specific routes.'
            }
        },
        'support': {
            question: 'How can we help you?',
            options: ['Contact', 'FAQ', 'Lost items', 'Feedback'],
            response: {
                'contact': 'Call +268 2404 0000 or email info@eswatini-transport.co.sz',
                'faq': 'Common questions are answered in our Support section.',
                'lost items': 'Report lost items at any station or call our support line.',
                'feedback': 'We welcome feedback through our website or mobile app.'
            }
        },
        'greeting': {
            response: {
                'hello': 'Hello! How can I help you today?',
                'hi': 'Hi there! What would you like to know about our transport services?',
                'hey': 'Hey! I can help with routes, tickets, tracking, or support.'
            }
        },
        'farewell': {
            response: {
                'bye': 'Goodbye! Safe travels!',
                'goodbye': 'Thank you for using our service. Have a great day!',
                'thanks': 'You\'re welcome! Let me know if you need anything else.'
            }
        }
    };

    // Toggle Chatbot Visibility
    function toggleChatbot() {
        chatbotState.visible = !chatbotState.visible;
        chatbotContainer.style.display = chatbotState.visible ? 'block' : 'none';
        if (chatbotState.visible) {
            renderMessages();
            document.getElementById('chatbot-input-field').focus();
        }
    }

    // Render Chat Messages
    function renderMessages() {
        const messagesContainer = chatbotContainer.querySelector('.chatbot-messages');
        messagesContainer.innerHTML = '';
        
        chatbotState.messages.forEach(msg => {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${msg.sender}`;
            
            if (msg.sender === 'bot') {
                messageDiv.innerHTML = `
                    <div class="message-content">
                        <p>${msg.text}</p>
                        ${msg.quickReplies ? 
                            `<div class="quick-replies">${msg.quickReplies.map(reply => 
                                `<button class="quick-reply-btn">${reply}</button>`
                            ).join('')}</div>` : ''
                        }
                    </div>
                `;
            } else {
                messageDiv.innerHTML = `<div class="message-content"><p>${msg.text}</p></div>`;
            }
            
            messagesContainer.appendChild(messageDiv);
        });
        
        // Scroll to bottom of messages
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Add event listeners to quick reply buttons
        document.querySelectorAll('.quick-reply-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                processUserInput(this.textContent);
            });
        });
    }

    // Process User Input
    function processUserInput(input) {
        input = input.trim();
        if (!input) return;
        
        // Add user message
        chatbotState.messages.push({
            sender: 'user',
            text: input
        });
        
        // Process input
        const lowerInput = input.toLowerCase();
        let botResponse = '';
        let quickReplies = [];
        
        // Check for greetings
        if (knowledgeBase.greeting.response[lowerInput]) {
            botResponse = knowledgeBase.greeting.response[lowerInput];
            quickReplies = ['Routes', 'Tickets', 'Tracking', 'Support'];
        }
        // Check for farewells
        else if (knowledgeBase.farewell.response[lowerInput]) {
            botResponse = knowledgeBase.farewell.response[lowerInput];
        }
        // Check for specific topics
        else if (lowerInput.includes('route') || knowledgeBase.routes.options.some(opt => lowerInput.includes(opt.toLowerCase()))) {
            const routeTopic = knowledgeBase.routes.options.find(opt => 
                lowerInput.includes(opt.toLowerCase())) || 'main routes';
            botResponse = knowledgeBase.routes.response[routeTopic.toLowerCase()] || 
                         "I can provide information about main routes, regional routes, city routes, or schedules.";
            quickReplies = knowledgeBase.routes.options;
        }
        else if (lowerInput.includes('ticket') || knowledgeBase.tickets.options.some(opt => lowerInput.includes(opt.toLowerCase()))) {
            const ticketTopic = knowledgeBase.tickets.options.find(opt => 
                lowerInput.includes(opt.toLowerCase())) || 'types';
            botResponse = knowledgeBase.tickets.response[ticketTopic.toLowerCase()] || 
                         "I can tell you about ticket types, prices, how to buy, or e-tickets.";
            quickReplies = knowledgeBase.tickets.options;
        }
        else if (lowerInput.includes('track') || knowledgeBase.tracking.options.some(opt => lowerInput.includes(opt.toLowerCase()))) {
            const trackTopic = knowledgeBase.tracking.options.find(opt => 
                lowerInput.includes(opt.toLowerCase())) || 'live tracker';
            botResponse = knowledgeBase.tracking.response[trackTopic.toLowerCase()] || 
                         "I can help with live tracking, ETAs, alerts, or notifications.";
            quickReplies = knowledgeBase.tracking.options;
        }
        else if (lowerInput.includes('support') || knowledgeBase.support.options.some(opt => lowerInput.includes(opt.toLowerCase()))) {
            const supportTopic = knowledgeBase.support.options.find(opt => 
                lowerInput.includes(opt.toLowerCase())) || 'contact';
            botResponse = knowledgeBase.support.response[supportTopic.toLowerCase()] || 
                         "I can help you contact support, find FAQs, report lost items, or give feedback.";
            quickReplies = knowledgeBase.support.options;
        }
        else {
            botResponse = "I can help with routes, tickets, tracking, or support. Which one do you need?";
            quickReplies = ['Routes', 'Tickets', 'Tracking', 'Support'];
        }
        
        // Add bot response
        chatbotState.messages.push({
            sender: 'bot',
            text: botResponse,
            quickReplies: quickReplies.length > 0 ? quickReplies : null
        });
        
        renderMessages();
    }

    // Event Listeners for Chatbot
    chatbotBtn.addEventListener('click', toggleChatbot);
    
    chatbotContainer.querySelector('.close-chatbot').addEventListener('click', toggleChatbot);
    
    chatbotContainer.querySelector('.send-btn').addEventListener('click', function() {
        const inputField = document.getElementById('chatbot-input-field');
        processUserInput(inputField.value);
        inputField.value = '';
        inputField.focus();
    });
    
    document.getElementById('chatbot-input-field').addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && this.value.trim()) {
            processUserInput(this.value);
            this.value = '';
        }
    });

    // Initial render
    renderMessages();
});