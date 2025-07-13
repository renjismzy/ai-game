// 修复版本的核心功能
console.log('Loading fix.js...');

// 确保基本的游戏状态存在
if (typeof gameState === 'undefined') {
    window.gameState = {
        identityProgress: 0,
        trustLevel: 50,
        clues: [],
        currentStage: 0,
        playerChoices: [],
        aiPersonality: 'neutral',
        aiIntelligence: {
            learningData: [],
            emotionalState: 'neutral',
            memoryBank: [],
            adaptationLevel: 0,
            conversationContext: [],
            userProfile: {
                communicationStyle: 'unknown',
                preferredTopics: [],
                emotionalTriggers: [],
                trustPattern: []
            }
        }
    };
}

// 确保回应历史存在
if (typeof responseHistory === 'undefined') {
    window.responseHistory = [];
}

// 简化的AI回应生成
function generateSimpleAIResponse(userMessage) {
    console.log('Generating simple AI response for:', userMessage);
    
    const responses = [
        "我理解你的意思了。请继续寻找线索。",
        "这是个有趣的观点。你能再详细说明吗？",
        "我需要更多信息才能帮助你解开这个谜题。",
        "你的思路很好，继续这个方向思考。",
        "这可能是一个重要的线索，我们应该记录下来。",
        "我不确定这是否与当前的谜题有关，但值得记住。"
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    return {
        text: randomResponse,
        clue: null
    };
}

// 简化的添加消息函数
function addSimpleMessage(text, sender) {
    console.log('Adding message:', text, 'from:', sender);
    
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) {
        console.error('Chat messages container not found');
        return;
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.innerHTML = `<strong>${sender === 'ai' ? 'AI' : '你'}:</strong> ${text}`;
    
    messageDiv.appendChild(contentDiv);
    
    // 为AI消息添加语音播放按钮
    if (sender === 'ai') {
        const speakBtn = document.createElement('button');
        speakBtn.className = 'speak-btn';
        speakBtn.innerHTML = '🔊';
        speakBtn.onclick = function() {
            console.log('Speak button clicked');
            // 简化的语音功能
            if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(text);
                speechSynthesis.speak(utterance);
            }
        };
        messageDiv.appendChild(speakBtn);
    }
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// 修复的发送消息函数
function fixedSendMessage() {
    console.log('Fixed sendMessage function called');
    
    const input = document.getElementById('userInput');
    if (!input) {
        console.error('User input element not found');
        alert('错误：输入框未找到');
        return;
    }
    
    const message = input.value.trim();
    console.log('User message:', message);
    
    if (!message) {
        console.log('Empty message, returning');
        return;
    }
    
    try {
        // 添加用户消息
        addSimpleMessage(message, 'user');
        console.log('User message added successfully');
        
        // 清空输入框
        input.value = '';
        
        // 生成AI回应
        setTimeout(() => {
            try {
                console.log('Generating AI response...');
                const aiResponse = generateSimpleAIResponse(message);
                console.log('AI response generated:', aiResponse);
                
                addSimpleMessage(aiResponse.text, 'ai');
                console.log('AI message added successfully');
                
            } catch (error) {
                console.error('Error in AI response generation:', error);
                addSimpleMessage('抱歉，我遇到了一些技术问题。', 'ai');
            }
        }, 1000 + Math.random() * 1000);
        
    } catch (error) {
        console.error('Error in fixedSendMessage function:', error);
        alert('发送消息时出现错误：' + error.message);
    }
}

// 修复事件监听器
function fixEventListeners() {
    console.log('Fixing event listeners...');
    
    const sendButton = document.getElementById('sendButton');
    const userInput = document.getElementById('userInput');
    
    if (sendButton) {
        // 移除现有的事件监听器
        sendButton.removeEventListener('click', sendMessage);
        // 添加修复的事件监听器
        sendButton.addEventListener('click', fixedSendMessage);
        console.log('Fixed send button event listener');
    } else {
        console.error('Send button not found');
    }
    
    if (userInput) {
        // 克隆元素来移除所有事件监听器
        const newUserInput = userInput.cloneNode(true);
        userInput.parentNode.replaceChild(newUserInput, userInput);
        
        // 添加修复的事件监听器
        newUserInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                console.log('Enter key pressed, sending message');
                fixedSendMessage();
            }
        });
        console.log('Fixed input keypress event listener');
    } else {
        console.error('User input element not found');
    }
}

// 应用修复
function applyFix() {
    console.log('Applying message sending fix...');
    
    // 等待DOM完全加载
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(fixEventListeners, 100);
        });
    } else {
        setTimeout(fixEventListeners, 100);
    }
    
    console.log('Fix applied successfully');
}

// 立即应用修复
applyFix();



console.log('Fix.js loaded successfully');