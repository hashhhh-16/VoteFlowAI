/**
 * VoteFlow AI Application Logic
 */

// DOM Elements
const chatLog = document.getElementById('chatLog');
const chatForm = document.getElementById('chatForm');
const userInput = document.getElementById('userInput');
const sendBtn = document.querySelector('.send-btn');
const quickActions = document.getElementById('quickActions');
const resetBtn = document.getElementById('resetChatBtn');
const chatContainer = document.getElementById('chatContainer');

// State
let isWaitingForResponse = false;
let sessionActive = false;

// --- Core Functions ---

function addMessage(content, sender) {
    const wrapper = document.createElement('div');
    wrapper.className = `message-wrapper message-${sender}`;
    
    const innerHTML = `<div class="bubble">${sender === 'user' ? escapeHTML(content) : content}</div>`;
    
    wrapper.innerHTML = innerHTML;
    chatLog.appendChild(wrapper);
    scrollToBottom();
}

function showTypingIndicator() {
    const wrapper = document.createElement('div');
    wrapper.className = 'message-wrapper message-ai';
    wrapper.id = 'typingIndicator';
    wrapper.innerHTML = `
        <div class="typing-indicator">
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
        </div>
    `;
    chatLog.appendChild(wrapper);
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) indicator.remove();
}

function scrollToBottom() {
    setTimeout(() => {
        chatLog.scrollTop = chatLog.scrollHeight;
    }, 50);
}

// --- Event Listeners ---

// Quick action cards
document.querySelectorAll('.action-card').forEach(card => {
    card.addEventListener('click', () => {
        if (isWaitingForResponse) return;
        const text = card.querySelector('h3').innerText;
        handleUserInput(text);
    });
});

// Form submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (isWaitingForResponse) return;

    const text = userInput.value.trim();
    if (!text) return;

    userInput.value = '';
    handleUserInput(text);
});

// Reset
resetBtn.addEventListener('click', () => {
    chatLog.innerHTML = '';
    quickActions.style.display = 'grid';
    document.getElementById('premiumFeatureContainer').style.display = 'flex';
    userInput.value = '';
    sessionActive = false;
    isWaitingForResponse = false;
    document.querySelector('.welcome-message').style.display = 'block';
});

// --- MAIN FUNCTION (BACKEND CONNECTED) ---

async function handleUserInput(text) {
    if (!sessionActive) {
        quickActions.style.display = 'none';
        document.getElementById('premiumFeatureContainer').style.display = 'none';
        document.querySelector('.welcome-message').style.display = 'none';
        sessionActive = true;
    }

    addMessage(text, 'user');

    isWaitingForResponse = true;
    userInput.disabled = true;
    sendBtn.disabled = true;

    showTypingIndicator();

    try {
        const response = await fetch("http://localhost:5000/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: text })
        });

        const data = await response.json();

        removeTypingIndicator();

        if (data && data.reply) {
            addMessage(data.reply, 'ai');
        } else {
            addMessage("Something went wrong. Please try again.", 'ai');
        }

    } catch (error) {
        removeTypingIndicator();
        addMessage(
            "I couldn't reach the service right now. You can still check your voter status on voters.eci.gov.in or contact your BLO. Please try again in a moment.",
            'ai'
        );
        console.error(error);
    }

    isWaitingForResponse = false;
    userInput.disabled = false;
    sendBtn.disabled = false;
    userInput.focus();
}

// Utility
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}