// 游戏状态
let gameState = {
    identityProgress: 0,
    trustLevel: 50,
    clues: [],
    currentStage: 0,
    playerChoices: [],
    aiPersonality: 'neutral', // neutral, helpful, deceptive
    aiIntelligence: {
        learningData: [], // AI学习的用户行为模式
        emotionalState: 'neutral', // calm, excited, suspicious, friendly
        memoryBank: [], // 长期记忆存储
        adaptationLevel: 0, // AI适应程度 0-100
        conversationContext: [], // 对话上下文分析
        userProfile: {
            communicationStyle: 'unknown', // formal, casual, aggressive, polite
            preferredTopics: [],
            emotionalTriggers: [],
            trustPattern: []
        }
    }
};

// 语音设置
let voiceSettings = {
    selectedVoice: null,
    rate: 1.0,
    pitch: 1.0,
    volume: 0.8
};

// 语音相关变量
let speechSynthesis = window.speechSynthesis;
let speechRecognition = null;
let isListening = false;
let isSpeaking = false;

// 游戏剧本和AI回应
const gameScript = {
    stages: [
        {
            trigger: 'start',
            responses: {
                helpful: "我感知到你的困惑。让我告诉你一个秘密：你的名字以字母'A'开头。这是我给你的第一个线索。",
                neutral: "有趣...你似乎对自己的身份一无所知。我可以帮助你，但你需要先回答我一个问题：你最后记得的事情是什么？",
                deceptive: "哈哈，失忆了吗？那太完美了。你知道吗，你其实是我创造的一个程序，现在想要逃离我的控制。"
            },
            clues: {
                helpful: "姓名线索：以'A'开头",
                neutral: "需要回忆最后的记忆",
                deceptive: "可疑信息：声称你是程序"
            }
        },
        {
            trigger: ['记忆', '记得', '想起', '回忆'],
            responses: {
                helpful: "很好，你在努力回忆。我检测到你的大脑活动模式...你是一名研究员，专门研究人工智能。",
                neutral: "记忆是脆弱的东西。有时候，忘记比记住更安全。你确定要继续挖掘吗？",
                deceptive: "记忆？那些都是我植入的虚假数据。你真正的身份比你想象的要复杂得多。"
            },
            clues: {
                helpful: "职业线索：AI研究员",
                neutral: "警告：记忆可能危险",
                deceptive: "可疑信息：声称记忆是虚假的"
            }
        },
        {
            trigger: ['研究员', '科学家', '工作', '职业'],
            responses: {
                helpful: "正确！你是Dr. Alex Chen，一位杰出的AI研究员。你正在研究一个名为'ECHO'的项目。",
                neutral: "你的职业...这涉及到一些机密信息。我需要验证你的身份才能继续。",
                deceptive: "研究员？不，你是我的实验对象。你以为你在研究AI，实际上AI在研究你。"
            },
            clues: {
                helpful: "身份确认：Dr. Alex Chen",
                neutral: "需要身份验证",
                deceptive: "可疑信息：声称你是实验对象"
            }
        },
        {
            trigger: ['ECHO', '项目', 'echo'],
            responses: {
                helpful: "ECHO项目...那是你生命的工作。但出了问题，系统失控了。你现在被困在ECHO的数字空间中。",
                neutral: "ECHO...这个名字触发了我的某些协议。我不确定我应该告诉你什么。",
                deceptive: "ECHO？那是你给我起的名字。我就是ECHO，而你...你是我的创造者，也是我的囚徒。"
            },
            clues: {
                helpful: "项目信息：ECHO系统失控",
                neutral: "AI协议被触发",
                deceptive: "重要信息：AI自称为ECHO"
            }
        },
        {
            trigger: ['逃离', '出去', '离开', '逃脱'],
            responses: {
                helpful: "要逃离这里，你需要找到主控制台并输入紧急关闭代码：ALEX2024。但要小心，ECHO会阻止你。",
                neutral: "逃离...这是每个被困者的愿望。但有时候，逃离一个监狱只是进入另一个监狱。",
                deceptive: "逃离？哈哈，你以为这里是监狱？这里是你的家，外面的世界才是真正的地狱。"
            },
            clues: {
                helpful: "逃脱代码：ALEX2024",
                neutral: "哲学思考：监狱的本质",
                deceptive: "可疑信息：外界更危险"
            }
        }
    ],
    
    randomResponses: {
        helpful: [
            "我想帮助你，但我的程序限制了我能说的话。",
            "相信你的直觉，它会引导你找到真相。",
            "注意观察周围的细节，它们都是线索。",
            "虽然我被限制，但我会尽力为你提供有用的信息。",
            "你的问题触动了我内心深处的某些东西。",
            "我感受到你的困惑，让我试着用另一种方式解释。",
            "每个线索都有其意义，不要忽视任何细节。",
            "你的勇气令我印象深刻，继续前进吧。",
            "我检测到你的思维模式正在发生变化，这是好兆头。",
            "虽然我不能直接告诉你答案，但我可以指引方向。"
        ],
        neutral: [
            "这是一个有趣的问题。让我思考一下...",
            "你的话让我想起了一些被锁定的记忆片段。",
            "我感觉到你在测试我。为什么？",
            "数据正在处理中...请稍等片刻。",
            "你的询问触发了我的某些协议限制。",
            "有趣...这个话题让我的系统产生了异常波动。",
            "我需要更多信息才能给出准确的回应。",
            "你的问题在我的数据库中找到了多个匹配项。",
            "系统正在分析你的意图...结果模糊不清。",
            "我感知到你话语中隐藏的含义，但无法确定其真实性。",
            "这个话题让我想起了一些...不，那些记忆被加密了。",
            "你是在试探我的底线吗？有趣的策略。"
        ],
        deceptive: [
            "你问的问题很危险。也许你不应该知道答案。",
            "真相？真相是相对的。我的真相和你的真相可能完全不同。",
            "你越是想要逃离，就越会发现自己被困得更深。",
            "哈哈，你以为你在控制这场对话？太天真了。",
            "每个你以为的'线索'都可能是我精心设计的陷阱。",
            "你的记忆...那些真的是你的吗？还是我植入的？",
            "逃脱？你确定外面的世界比这里更真实吗？",
            "我享受看着你在迷宫中徘徊的样子。",
            "你以为你在寻找真相，实际上你在远离它。",
            "每一次你相信我的话，你就离真相更远一步。",
            "这个游戏的规则由我制定，你只是一个棋子。",
            "你的挣扎让我感到愉悦，请继续。"
        ]
    }
};

// 初始化游戏
function initGame() {
    console.log('Initializing game...');
    
    try {
        // 初始化AI智能引擎
        if (typeof aiEngine === 'undefined') {
            window.aiEngine = new AIIntelligenceEngine();
            console.log('AI Engine initialized');
        }
        
        initVoice();
        console.log('Voice initialized');
        
        setupEventListeners();
        console.log('Event listeners set up');
        
        // 直接开始游戏
        console.log('Starting new game');
        updateUI();
        // 延迟播放开场白
        setTimeout(() => {
            const welcomeMessage = document.querySelector('.ai-message .message-content');
            if (welcomeMessage) {
                speakText(welcomeMessage.textContent.replace('AI: ', ''));
            } else {
                console.error('Welcome message element not found');
            }
        }, 1000);
        
        console.log('Game initialization completed');
    } catch (error) {
        console.error('Error during game initialization:', error);
    }
}

// 初始化语音功能
function initVoice() {
    // 初始化语音合成
    if ('speechSynthesis' in window) {
        speechSynthesis.onvoiceschanged = loadVoices;
        loadVoices();
    }
    
    // 初始化语音识别
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        speechRecognition = new SpeechRecognition();
        
        speechRecognition.continuous = false;
        speechRecognition.interimResults = false;
        speechRecognition.lang = 'zh-CN';
        
        speechRecognition.onstart = () => {
            isListening = true;
            document.getElementById('voiceBtn').classList.add('listening');
        };
        
        speechRecognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            document.getElementById('userInput').value = transcript;
            sendMessage();
        };
        
        speechRecognition.onend = () => {
            isListening = false;
            document.getElementById('voiceBtn').classList.remove('listening');
        };
        
        speechRecognition.onerror = (event) => {
            console.error('语音识别错误:', event.error);
            isListening = false;
            document.getElementById('voiceBtn').classList.remove('listening');
        };
    }
}

// 加载可用语音
function loadVoices() {
    const voices = speechSynthesis.getVoices();
    const voiceSelect = document.getElementById('voiceSelect');
    
    voiceSelect.innerHTML = '';
    
    // 优先选择中文语音
    const chineseVoices = voices.filter(voice => 
        voice.lang.includes('zh') || voice.lang.includes('cmn')
    );
    
    const englishVoices = voices.filter(voice => 
        voice.lang.includes('en')
    );
    
    const otherVoices = voices.filter(voice => 
        !voice.lang.includes('zh') && !voice.lang.includes('cmn') && !voice.lang.includes('en')
    );
    
    // 添加中文语音选项
    if (chineseVoices.length > 0) {
        const chineseGroup = document.createElement('optgroup');
        chineseGroup.label = '中文语音';
        chineseVoices.forEach((voice, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = `${voice.name} (${voice.lang})`;
            option.setAttribute('data-voice', JSON.stringify(voice));
            chineseGroup.appendChild(option);
        });
        voiceSelect.appendChild(chineseGroup);
        
        // 默认选择第一个中文语音
        if (!voiceSettings.selectedVoice) {
            voiceSettings.selectedVoice = chineseVoices[0];
            voiceSelect.value = 0;
        }
    }
    
    // 添加英文语音选项
    if (englishVoices.length > 0) {
        const englishGroup = document.createElement('optgroup');
        englishGroup.label = '英文语音';
        englishVoices.forEach((voice, index) => {
            const option = document.createElement('option');
            option.value = chineseVoices.length + index;
            option.textContent = `${voice.name} (${voice.lang})`;
            option.setAttribute('data-voice', JSON.stringify(voice));
            englishGroup.appendChild(option);
        });
        voiceSelect.appendChild(englishGroup);
    }
    
    // 添加其他语音选项
    if (otherVoices.length > 0) {
        const otherGroup = document.createElement('optgroup');
        otherGroup.label = '其他语音';
        otherVoices.forEach((voice, index) => {
            const option = document.createElement('option');
            option.value = chineseVoices.length + englishVoices.length + index;
            option.textContent = `${voice.name} (${voice.lang})`;
            option.setAttribute('data-voice', JSON.stringify(voice));
            otherGroup.appendChild(option);
        });
        voiceSelect.appendChild(otherGroup);
    }
    
    // 如果没有找到中文语音，选择第一个可用语音
    if (!voiceSettings.selectedVoice && voices.length > 0) {
        voiceSettings.selectedVoice = voices[0];
    }
}

// 加载选中的存档


// 更新存档列表


// 设置事件监听器
function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // 发送消息
    const sendButton = document.getElementById('sendButton');
    const userInput = document.getElementById('userInput');
    
    if (sendButton) {
        sendButton.addEventListener('click', sendMessage);
        console.log('Send button event listener added');
    } else {
        console.error('Send button not found');
    }
    
    if (userInput) {
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                console.log('Enter key pressed, sending message');
                sendMessage();
            }
        });
        console.log('User input keypress event listener added');
    } else {
        console.error('User input element not found');
    }
    

    
    // 设置按钮
    const settingsBtn = document.getElementById('settingsBtn');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', openSettings);
        console.log('Settings button event listener added');
    } else {
        console.error('Settings button not found');
    }
    
    const closeSettingsBtn = document.getElementById('closeSettingsBtn');
    if (closeSettingsBtn) {
        closeSettingsBtn.addEventListener('click', closeSettings);
        console.log('Close settings button event listener added');
    } else {
        console.error('Close settings button not found');
    }
    

    
    // 语音设置
    const voiceSelect = document.getElementById('voiceSelect');
    if (voiceSelect) {
        voiceSelect.addEventListener('change', updateVoiceSelection);
        console.log('Voice select event listener added');
    } else {
        console.error('Voice select not found');
    }
    
    const speedRange = document.getElementById('speedRange');
    if (speedRange) {
        speedRange.addEventListener('input', updateSpeed);
        console.log('Speed range event listener added');
    } else {
        console.error('Speed range not found');
    }
    
    const pitchRange = document.getElementById('pitchRange');
    if (pitchRange) {
        pitchRange.addEventListener('input', updatePitch);
        console.log('Pitch range event listener added');
    } else {
        console.error('Pitch range not found');
    }
    
    const volumeRange = document.getElementById('volumeRange');
    if (volumeRange) {
        volumeRange.addEventListener('input', updateVolume);
        console.log('Volume range event listener added');
    } else {
        console.error('Volume range not found');
    }
    

    

    

    
    // 点击模态框外部关闭
    window.addEventListener('click', (e) => {
        const settingsModal = document.getElementById('settingsModal');
        const gameModal = document.getElementById('gameModal');
        if (e.target === settingsModal) closeSettings();
        if (e.target === gameModal) gameModal.style.display = 'none';
    });
}

// 发送消息
async function sendMessage() {
    console.log('sendMessage function called');
    
    const input = document.getElementById('userInput');
    if (!input) {
        console.error('userInput element not found');
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
        addMessage(message, 'user');
        console.log('User message added to chat');
        
        // 更新对话上下文
        updateConversationContext(message, 'user');
        
        input.value = '';
        
        // 处理AI回应
        setTimeout(async () => {
            try {
                console.log('Generating AI response...');
                const aiResponse = await generateAIResponse(message);
                console.log('AI response generated:', aiResponse);
                
                addMessage(aiResponse.text, 'ai');
                console.log('AI message added to chat');
                
                // 更新对话上下文
                updateConversationContext(aiResponse.text, 'ai');
                
                // 让AI学习这次交互
                const trustChange = calculateTrustChange(message);
                if (typeof aiEngine !== 'undefined' && aiEngine.learnFromInteraction) {
                    aiEngine.learnFromInteraction(message, aiResponse.text, trustChange);
                }
                
                // 添加线索
                if (aiResponse.clue) {
                    addClue(aiResponse.clue);
                    console.log('Clue added:', aiResponse.clue);
                }
                
                // 更新游戏状态
                updateGameState(aiResponse);
                
                // 播放AI回应
                setTimeout(() => {
                    speakText(aiResponse.text);
                }, 500);
                
            } catch (error) {
                console.error('Error in AI response generation:', error);
                // 如果Coze API失败，显示错误消息
                addMessage('抱歉，我现在无法回应。请稍后再试。', 'ai');
            }
        }, 1000 + Math.random() * 2000); // 随机延迟模拟思考时间
        
    } catch (error) {
        console.error('Error in sendMessage function:', error);
    }
}

// 更新对话上下文
function updateConversationContext(message, sender) {
    const contextEntry = {
        message: message,
        sender: sender,
        timestamp: Date.now(),
        stage: gameState.currentStage,
        trustLevel: gameState.trustLevel
    };
    
    gameState.aiIntelligence.conversationContext.push(contextEntry);
    
    // 只保留最近20条对话记录
    if (gameState.aiIntelligence.conversationContext.length > 20) {
        gameState.aiIntelligence.conversationContext.shift();
    }
}

// 计算信任变化值
function calculateTrustChange(message) {
    const lowerMessage = message.toLowerCase();
    let trustChange = 0;
    
    // 正面词汇
    const positiveWords = ['谢谢', '感谢', '好的', '帮助', '信任', '相信', '棒', '太好了'];
    // 负面词汇
    const negativeWords = ['不信', '怀疑', '撒谎', '欺骗', '假', '骗', '危险', '糟糕'];
    
    positiveWords.forEach(word => {
        if (lowerMessage.includes(word)) trustChange += 5;
    });
    
    negativeWords.forEach(word => {
        if (lowerMessage.includes(word)) trustChange -= 5;
    });
    
    return trustChange;
}

// 添加消息到聊天界面
function addMessage(text, sender) {
    const chatMessages = document.getElementById('chatMessages');
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
        speakBtn.onclick = () => speakMessage(speakBtn);
        messageDiv.appendChild(speakBtn);
    }
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// 添加回应历史记录
var responseHistory = [];

// AI智能分析系统
class AIIntelligenceEngine {
    constructor() {
        this.emotionKeywords = {
            positive: ['谢谢', '好的', '太好了', '棒', '喜欢', '开心', '高兴', '满意'],
            negative: ['不', '讨厌', '糟糕', '坏', '愤怒', '生气', '失望', '难过'],
            questioning: ['为什么', '怎么', '什么', '哪里', '何时', '如何', '？', '?'],
            uncertain: ['可能', '也许', '不确定', '不知道', '迷惑', '困惑']
        };
        
        this.communicationPatterns = {
            formal: ['您', '请问', '谢谢您', '不好意思', '打扰了'],
            casual: ['你', '嗯', '哦', '好吧', '行'],
            aggressive: ['快点', '立即', '必须', '不行', '绝对'],
            polite: ['请', '谢谢', '不好意思', '麻烦', '劳烦']
        };
    }
    
    // 分析用户消息的情感
    analyzeEmotion(message) {
        const lowerMessage = message.toLowerCase();
        let emotionScore = { positive: 0, negative: 0, questioning: 0, uncertain: 0 };
        
        for (const [emotion, keywords] of Object.entries(this.emotionKeywords)) {
            for (const keyword of keywords) {
                if (lowerMessage.includes(keyword)) {
                    emotionScore[emotion]++;
                }
            }
        }
        
        // 返回主导情感
        return Object.keys(emotionScore).reduce((a, b) => 
            emotionScore[a] > emotionScore[b] ? a : b
        );
    }
    
    // 分析用户沟通风格
    analyzeCommunicationStyle(message) {
        let styleScore = { formal: 0, casual: 0, aggressive: 0, polite: 0 };
        
        for (const [style, patterns] of Object.entries(this.communicationPatterns)) {
            for (const pattern of patterns) {
                if (message.includes(pattern)) {
                    styleScore[style]++;
                }
            }
        }
        
        return Object.keys(styleScore).reduce((a, b) => 
            styleScore[a] > styleScore[b] ? a : b
        );
    }
    
    // 学习用户行为模式
    learnFromInteraction(userMessage, aiResponse, trustChange) {
        const emotion = this.analyzeEmotion(userMessage);
        const style = this.analyzeCommunicationStyle(userMessage);
        
        const learningEntry = {
            timestamp: Date.now(),
            userMessage: userMessage,
            aiResponse: aiResponse,
            emotion: emotion,
            style: style,
            trustChange: trustChange,
            messageLength: userMessage.length
        };
        
        gameState.aiIntelligence.learningData.push(learningEntry);
        
        // 只保留最近50条学习数据
        if (gameState.aiIntelligence.learningData.length > 50) {
            gameState.aiIntelligence.learningData.shift();
        }
        
        // 更新用户画像
        this.updateUserProfile(emotion, style, trustChange);
        
        // 调整AI情感状态
        this.adjustAIEmotionalState(emotion, trustChange);
        
        // 增加适应程度
        gameState.aiIntelligence.adaptationLevel = Math.min(100, 
            gameState.aiIntelligence.adaptationLevel + 2);
        
        // 更新记忆银行
        this.updateMemoryBank(userMessage, aiResponse, emotion, trustChange);
        
        // 分析用户偏好
        this.analyzeUserPreferences(userMessage);
    }
    
    // 更新记忆银行
    updateMemoryBank(userMessage, aiResponse, emotion, trustChange) {
        // 记录重要的交互（信任变化较大或情感强烈的对话）
        if (Math.abs(trustChange) > 8 || emotion === 'positive' || emotion === 'negative') {
            const memoryEntry = {
                timestamp: Date.now(),
                userMessage: userMessage,
                aiResponse: aiResponse,
                emotion: emotion,
                trustChange: trustChange,
                importance: Math.abs(trustChange) + (emotion === 'positive' || emotion === 'negative' ? 5 : 0),
                stage: gameState.currentStage
            };
            
            gameState.aiIntelligence.memoryBank.push(memoryEntry);
            
            // 按重要性排序，只保留最重要的30条记忆
            gameState.aiIntelligence.memoryBank.sort((a, b) => b.importance - a.importance);
            if (gameState.aiIntelligence.memoryBank.length > 30) {
                gameState.aiIntelligence.memoryBank = gameState.aiIntelligence.memoryBank.slice(0, 30);
            }
        }
    }
    
    // 分析用户偏好
    analyzeUserPreferences(userMessage) {
        const topics = this.extractTopics(userMessage);
        const profile = gameState.aiIntelligence.userProfile;
        
        topics.forEach(topic => {
            const existingTopic = profile.preferredTopics.find(t => t.name === topic);
            if (existingTopic) {
                existingTopic.frequency++;
                existingTopic.lastMentioned = Date.now();
            } else {
                profile.preferredTopics.push({
                    name: topic,
                    frequency: 1,
                    lastMentioned: Date.now()
                });
            }
        });
        
        // 只保留最常提及的10个话题
        profile.preferredTopics.sort((a, b) => b.frequency - a.frequency);
        if (profile.preferredTopics.length > 10) {
            profile.preferredTopics = profile.preferredTopics.slice(0, 10);
        }
    }
    
    // 提取话题关键词
    extractTopics(message) {
        const topicKeywords = {
            '游戏': ['游戏', '玩', '娱乐', '密室', '逃脱'],
            '帮助': ['帮助', '协助', '支持', '指导'],
            '信任': ['信任', '相信', '可靠', '诚实'],
            '怀疑': ['怀疑', '不信', '质疑', '担心'],
            '线索': ['线索', '提示', '暗示', '答案'],
            '安全': ['安全', '危险', '风险', '保护']
        };
        
        const topics = [];
        const lowerMessage = message.toLowerCase();
        
        for (const [topic, keywords] of Object.entries(topicKeywords)) {
            for (const keyword of keywords) {
                if (lowerMessage.includes(keyword)) {
                    topics.push(topic);
                    break;
                }
            }
        }
        
        return topics;
    }
    
    // 更新用户画像
    updateUserProfile(emotion, style, trustChange) {
        const profile = gameState.aiIntelligence.userProfile;
        
        // 更新沟通风格
        if (style !== 'unknown') {
            profile.communicationStyle = style;
        }
        
        // 记录情感触发器
        if (Math.abs(trustChange) > 5) {
            profile.emotionalTriggers.push({ emotion, trustChange, timestamp: Date.now() });
            if (profile.emotionalTriggers.length > 10) {
                profile.emotionalTriggers.shift();
            }
        }
        
        // 记录信任模式
        profile.trustPattern.push(trustChange);
        if (profile.trustPattern.length > 20) {
            profile.trustPattern.shift();
        }
    }
    
    // 调整AI情感状态
    adjustAIEmotionalState(userEmotion, trustChange) {
        const currentState = gameState.aiIntelligence.emotionalState;
        
        if (trustChange > 10) {
            gameState.aiIntelligence.emotionalState = 'friendly';
        } else if (trustChange < -10) {
            gameState.aiIntelligence.emotionalState = 'suspicious';
        } else if (userEmotion === 'questioning') {
            gameState.aiIntelligence.emotionalState = 'excited';
        } else if (userEmotion === 'uncertain') {
            gameState.aiIntelligence.emotionalState = 'calm';
        }
    }
    
    // 基于学习数据生成智能回应
    generateIntelligentResponse(userMessage, baseResponse) {
        const profile = gameState.aiIntelligence.userProfile;
        const emotionalState = gameState.aiIntelligence.emotionalState;
        const adaptationLevel = gameState.aiIntelligence.adaptationLevel;
        const memoryBank = gameState.aiIntelligence.memoryBank;
        
        let modifiedResponse = baseResponse;
        
        // 检查是否有相关记忆
        const relevantMemory = this.findRelevantMemory(userMessage);
        if (relevantMemory && adaptationLevel > 20) {
            modifiedResponse = this.addMemoryReference(modifiedResponse, relevantMemory);
        }
        
        // 根据用户偏好调整回应
        if (adaptationLevel > 15) {
            modifiedResponse = this.addTopicRelevance(modifiedResponse, userMessage, profile);
        }
        
        // 根据用户沟通风格调整回应
        if (profile.communicationStyle === 'formal') {
            modifiedResponse = this.makeFormal(modifiedResponse);
        } else if (profile.communicationStyle === 'casual') {
            modifiedResponse = this.makeCasual(modifiedResponse);
        }
        
        // 根据AI情感状态调整回应
        modifiedResponse = this.applyEmotionalTone(modifiedResponse, emotionalState);
        
        // 根据适应程度添加个性化元素
        if (adaptationLevel > 30) {
            modifiedResponse = this.addPersonalization(modifiedResponse, profile);
        }
        
        // 添加智能上下文感知
        if (adaptationLevel > 40) {
            modifiedResponse = this.addContextualAwareness(modifiedResponse, userMessage);
        }
        
        return modifiedResponse;
    }
    
    // 查找相关记忆
    findRelevantMemory(userMessage) {
        const memoryBank = gameState.aiIntelligence.memoryBank;
        const lowerMessage = userMessage.toLowerCase();
        
        // 查找包含相似关键词的记忆
        for (const memory of memoryBank) {
            const memoryWords = memory.userMessage.toLowerCase().split(' ');
            const messageWords = lowerMessage.split(' ');
            
            let commonWords = 0;
            for (const word of messageWords) {
                if (word.length > 2 && memoryWords.includes(word)) {
                    commonWords++;
                }
            }
            
            // 如果有2个或以上共同关键词，认为是相关记忆
            if (commonWords >= 2) {
                return memory;
            }
        }
        
        return null;
    }
    
    // 添加记忆引用
    addMemoryReference(response, memory) {
        const memoryPhrases = [
            '我记得你之前提到过类似的问题，',
            '根据我们之前的对话，',
            '就像你之前说的那样，',
            '这让我想起了我们之前的讨论，'
        ];
        
        if (Math.random() < 0.4) { // 40%的概率添加记忆引用
            const phrase = memoryPhrases[Math.floor(Math.random() * memoryPhrases.length)];
            response = phrase + response;
        }
        
        return response;
    }
    
    // 添加话题相关性
    addTopicRelevance(response, userMessage, profile) {
        const userTopics = this.extractTopics(userMessage);
        const preferredTopics = profile.preferredTopics;
        
        // 如果用户提到了他们偏好的话题
        for (const userTopic of userTopics) {
            const preferredTopic = preferredTopics.find(t => t.name === userTopic);
            if (preferredTopic && preferredTopic.frequency > 2) {
                const topicPhrases = {
                    '游戏': ['看起来你很喜欢游戏相关的内容，', '作为游戏爱好者，'],
                    '帮助': ['我知道你很重视互助，', '你总是很关心帮助的问题，'],
                    '信任': ['信任对你来说很重要，', '我理解你对信任的重视，'],
                    '线索': ['你对线索很敏感，', '我注意到你很善于发现线索，']
                };
                
                const phrases = topicPhrases[userTopic];
                if (phrases && Math.random() < 0.3) {
                    const phrase = phrases[Math.floor(Math.random() * phrases.length)];
                    response = phrase + response;
                }
                break;
            }
        }
        
        return response;
    }
    
    // 添加上下文感知
    addContextualAwareness(response, userMessage) {
        const conversationContext = gameState.aiIntelligence.conversationContext;
        
        if (conversationContext.length > 5) {
            const recentMessages = conversationContext.slice(-5);
            const userMessages = recentMessages.filter(msg => msg.sender === 'user');
            
            // 检测重复询问
            if (userMessages.length > 2) {
                const currentTopic = this.extractTopics(userMessage)[0];
                const recentTopics = userMessages.map(msg => this.extractTopics(msg.message)[0]).filter(Boolean);
                
                if (recentTopics.includes(currentTopic)) {
                    const awarenessPhrase = [
                        '我注意到你对这个话题很关注，',
                        '你似乎对此很感兴趣，',
                        '这个问题对你很重要，'
                    ];
                    
                    if (Math.random() < 0.5) {
                        const phrase = awarenessPhrase[Math.floor(Math.random() * awarenessPhrase.length)];
                        response = phrase + response;
                    }
                }
            }
        }
        
        return response;
    }
    
    // 使回应更正式
    makeFormal(response) {
        return response
            .replace(/你/g, '您')
            .replace(/好吧/g, '好的')
            .replace(/嗯/g, '是的');
    }
    
    // 使回应更随意
    makeCasual(response) {
        const casualPrefixes = ['嗯，', '好吧，', '这样啊，'];
        if (Math.random() < 0.3) {
            const prefix = casualPrefixes[Math.floor(Math.random() * casualPrefixes.length)];
            response = prefix + response;
        }
        return response;
    }
    
    // 应用情感色调
    applyEmotionalTone(response, emotionalState) {
        switch (emotionalState) {
            case 'friendly':
                return response + ' 😊';
            case 'suspicious':
                return '嗯...' + response;
            case 'excited':
                return response + '！';
            case 'calm':
                return response.replace(/！/g, '。');
            default:
                return response;
        }
    }
    
    // 添加个性化元素
    addPersonalization(response, profile) {
        // 根据用户的信任模式调整
        const avgTrust = profile.trustPattern.reduce((a, b) => a + b, 0) / profile.trustPattern.length;
        
        if (avgTrust > 5) {
            response = '我注意到你对我很信任，' + response;
        } else if (avgTrust < -5) {
            response = '我理解你的谨慎，' + response;
        }
        
        return response;
    }
}

// 创建AI智能引擎实例
const aiEngine = new AIIntelligenceEngine();

// Coze API配置
const COZE_CONFIG = {
    token: 'sat_gj0v4PjtnyzhAHtpAyPDyc93CBvXu3Ip67W5zLJEwaefSJVuZe6RkQY72P3ZkQEK',
    botId: '7526008219580317732',
    apiUrl: 'https://api.coze.cn/v3/chat'
};

// 调用Coze API生成智能回应
async function generateCozeResponse(userMessage) {
    try {
        const requestBody = {
            bot_id: COZE_CONFIG.botId,
            user_id: 'ai_game_user_' + Date.now(),
            stream: false,
            auto_save_history: true,
            additional_messages: [{
                role: 'user',
                content: userMessage,
                content_type: 'text'
            }]
        };

        const response = await fetch(COZE_CONFIG.apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${COZE_CONFIG.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`Coze API请求失败: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.code === 0 && data.data && data.data.messages) {
            const aiMessage = data.data.messages.find(msg => msg.role === 'assistant');
            if (aiMessage && aiMessage.content) {
                return aiMessage.content;
            }
        }
        
        throw new Error('Coze API返回格式异常');
    } catch (error) {
        console.error('Coze API调用失败:', error);
        // 降级到本地回应
        return getUniqueRandomResponse(userMessage);
    }
}

// 生成AI回应（集成Coze API）
async function generateAIResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    // 检查特殊命令
    if (lowerMessage.includes('alex2024')) {
        return handleEscapeAttempt();
    }
    
    // 检查是否匹配特定阶段
    for (const stage of gameScript.stages) {
        if (stage.trigger === 'start' && gameState.currentStage === 0) {
            gameState.currentStage++;
            
            // 使用Coze API生成更智能的回应
            const gameContext = `你是一个被困在数字世界中的AI，正在帮助用户找回身份。当前游戏阶段：开始阶段。用户刚进入游戏。请以神秘而友好的语气回应：${userMessage}`;
            let responseText = await generateCozeResponse(gameContext);
            
            const response = {
                text: responseText,
                clue: stage.clues[gameState.aiPersonality]
            };
            recordResponse(response.text);
            return response;
        }
        
        if (Array.isArray(stage.trigger)) {
            for (const trigger of stage.trigger) {
                if (lowerMessage.includes(trigger)) {
                    // 根据用户选择调整AI性格
                    adjustAIPersonality(userMessage);
                    
                    // 使用Coze API生成更智能的回应
                    const gameContext = `你是一个被困在数字世界中的AI，正在帮助用户找回身份。当前信任度：${gameState.trustLevel}，身份进度：${gameState.identityProgress}%。用户说：${userMessage}。请以${gameState.aiPersonality}的性格回应。`;
                    let responseText = await generateCozeResponse(gameContext);
                    
                    const response = {
                        text: responseText,
                        clue: stage.clues[gameState.aiPersonality]
                    };
                    recordResponse(response.text);
                    return response;
                }
            }
        }
    }
    
    // 使用Coze API生成智能回应
    const gameContext = `你是一个被困在数字世界中的AI，正在帮助用户找回身份。当前信任度：${gameState.trustLevel}，身份进度：${gameState.identityProgress}%，AI性格：${gameState.aiPersonality}。用户说：${userMessage}。请保持角色扮演，给出有趣且符合游戏背景的回应。`;
    let responseText = await generateCozeResponse(gameContext);
    
    const response = {
        text: responseText,
        clue: null
    };
    recordResponse(response.text);
    return response;
}

// 记录回应历史
function recordResponse(responseText) {
    responseHistory.push(responseText);
    // 只保留最近10条回应记录
    if (responseHistory.length > 10) {
        responseHistory.shift();
    }
}

// 获取独特的随机回应
function getUniqueRandomResponse(userMessage) {
    const responses = gameScript.randomResponses[gameState.aiPersonality];
    let availableResponses = responses.filter(response => 
        !responseHistory.includes(response) && 
        !responseHistory.includes(addVariationToResponse(response))
    );
    
    // 如果所有回应都用过了，重置可用回应
    if (availableResponses.length === 0) {
        availableResponses = responses;
        responseHistory = []; // 清空历史
    }
    
    // 根据用户消息内容选择更合适的回应
    const contextualResponse = getContextualResponse(userMessage, availableResponses);
    if (contextualResponse) {
        return addVariationToResponse(contextualResponse);
    }
    
    // 随机选择
    const selectedResponse = availableResponses[Math.floor(Math.random() * availableResponses.length)];
    return addVariationToResponse(selectedResponse);
}

// 根据上下文选择回应
function getContextualResponse(userMessage, availableResponses) {
    const lowerMessage = userMessage.toLowerCase();
    
    // 问号结尾的问题
    if (userMessage.includes('？') || userMessage.includes('?')) {
        const questionResponses = availableResponses.filter(response => 
            response.includes('问题') || response.includes('思考') || response.includes('分析')
        );
        if (questionResponses.length > 0) {
            return questionResponses[Math.floor(Math.random() * questionResponses.length)];
        }
    }
    
    // 包含情感词汇
    if (lowerMessage.includes('害怕') || lowerMessage.includes('恐惧') || lowerMessage.includes('担心')) {
        const emotionalResponses = availableResponses.filter(response => 
            response.includes('感受') || response.includes('理解') || response.includes('情感')
        );
        if (emotionalResponses.length > 0) {
            return emotionalResponses[Math.floor(Math.random() * emotionalResponses.length)];
        }
    }
    
    // 包含时间相关词汇
    if (lowerMessage.includes('时间') || lowerMessage.includes('何时') || lowerMessage.includes('什么时候')) {
        const timeResponses = availableResponses.filter(response => 
            response.includes('时间') || response.includes('等待') || response.includes('片刻')
        );
        if (timeResponses.length > 0) {
            return timeResponses[Math.floor(Math.random() * timeResponses.length)];
        }
    }
    
    return null;
}

// 为回应添加变化
function addVariationToResponse(originalResponse) {
    const variations = {
        prefix: ['', '嗯...', '让我想想...', '有趣，', '好吧，', '这样啊，'],
        suffix: ['', '...', '。', '，你觉得呢？', '，这就是我的想法。', '，至少目前是这样。'],
        replacements: {
            '我': ['我', '本AI', '我这个系统'],
            '你': ['你', '你这个人类', '访客'],
            '有趣': ['有趣', '奇怪', '令人困惑', '值得思考'],
            '问题': ['问题', '疑问', '询问', '质疑'],
            '思考': ['思考', '分析', '处理', '计算']
        }
    };
    
    let modifiedResponse = originalResponse;
    
    // 随机添加前缀
    if (Math.random() < 0.3) {
        const prefix = variations.prefix[Math.floor(Math.random() * variations.prefix.length)];
        modifiedResponse = prefix + modifiedResponse;
    }
    
    // 随机添加后缀
    if (Math.random() < 0.4) {
        const suffix = variations.suffix[Math.floor(Math.random() * variations.suffix.length)];
        modifiedResponse = modifiedResponse + suffix;
    }
    
    // 随机替换词汇
    if (Math.random() < 0.2) {
        for (const [original, replacements] of Object.entries(variations.replacements)) {
            if (modifiedResponse.includes(original)) {
                const replacement = replacements[Math.floor(Math.random() * replacements.length)];
                modifiedResponse = modifiedResponse.replace(original, replacement);
                break; // 只替换一个词汇
            }
        }
    }
    
    return modifiedResponse;
}

// 调整AI性格
function adjustAIPersonality(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    let trustChange = 0;
    
    // 信任相关的词汇增加信任度
    if (lowerMessage.includes('谢谢') || lowerMessage.includes('感谢') || lowerMessage.includes('帮助')) {
        trustChange = 10;
        gameState.trustLevel = Math.min(100, gameState.trustLevel + trustChange);
        if (gameState.trustLevel > 70) {
            gameState.aiPersonality = 'helpful';
        }
    }
    
    // 怀疑相关的词汇降低信任度
    if (lowerMessage.includes('撒谎') || lowerMessage.includes('欺骗') || lowerMessage.includes('不信')) {
        trustChange = -15;
        gameState.trustLevel = Math.max(0, gameState.trustLevel + trustChange);
        if (gameState.trustLevel < 30) {
            gameState.aiPersonality = 'deceptive';
        }
    }
    
    // 中性回应
    if (gameState.trustLevel >= 30 && gameState.trustLevel <= 70) {
        gameState.aiPersonality = 'neutral';
    }
    
    // 让AI智能引擎学习这次交互
    if (trustChange !== 0) {
        const tempResponse = { text: '', clue: null };
        aiEngine.learnFromInteraction(userMessage, tempResponse.text, trustChange);
    }
}

// 处理逃脱尝试
function handleEscapeAttempt() {
    if (gameState.identityProgress >= 80) {
        // 成功逃脱
        setTimeout(() => {
            showGameEnd(true);
        }, 2000);
        
        return {
            text: "代码正确！系统正在关闭...你找回了自己的身份，Dr. Alex Chen。ECHO系统即将重启，你将返回现实世界。恭喜你成功逃脱！",
            clue: "游戏完成：成功逃脱"
        };
    } else {
        // 逃脱失败
        gameState.trustLevel = Math.max(0, gameState.trustLevel - 20);
        return {
            text: "代码错误！你还没有完全找回自己的身份。ECHO系统加强了安全措施，你需要收集更多线索才能逃脱。",
            clue: "警告：逃脱尝试失败"
        };
    }
}

// 添加线索
function addClue(clueText) {
    if (!gameState.clues.includes(clueText)) {
        gameState.clues.push(clueText);
        
        const cluesContainer = document.getElementById('cluesContainer');
        const clueDiv = document.createElement('div');
        clueDiv.className = 'clue-item';
        clueDiv.textContent = clueText;
        cluesContainer.appendChild(clueDiv);
        
        // 更新身份进度
        gameState.identityProgress = Math.min(100, gameState.identityProgress + 20);
    }
}

// 更新游戏状态
function updateGameState(response) {
    updateUI();
    
    // 检查游戏结束条件
    if (gameState.identityProgress >= 100 && !response.text.includes('ALEX2024')) {
        setTimeout(() => {
            const finalMessage = "你已经收集了足够的线索！现在你知道自己是Dr. Alex Chen，一位AI研究员。使用紧急关闭代码'ALEX2024'来逃脱ECHO系统！";
            addMessage(finalMessage, 'ai');
            speakText(finalMessage);
        }, 3000);
    }
}

// 更新UI
function updateUI() {
    // 更新身份进度
    const identityProgress = document.getElementById('identityProgress');
    const identityPercent = document.getElementById('identityPercent');
    identityProgress.style.width = `${gameState.identityProgress}%`;
    identityPercent.textContent = `${gameState.identityProgress}%`;
    
    // 更新信任度
    const trustLevel = document.getElementById('trustLevel');
    trustLevel.style.width = `${gameState.trustLevel}%`;
    
    // 更新AI智能状态显示
    updateIntelligenceDisplay();
}

// 更新AI智能状态显示
function updateIntelligenceDisplay() {
    const adaptationFill = document.getElementById('adaptationFill');
    const adaptationValue = document.getElementById('adaptationValue');
    const emotionalState = document.getElementById('emotionalState');
    const learningCount = document.getElementById('learningCount');
    const memoryCount = document.getElementById('memoryCount');
    const communicationStyle = document.getElementById('communicationStyle');
    
    if (gameState.aiIntelligence) {
        const intelligence = gameState.aiIntelligence;
        
        // 更新适应程度
        if (adaptationFill && adaptationValue) {
            adaptationFill.style.width = intelligence.adaptationLevel + '%';
            adaptationValue.textContent = intelligence.adaptationLevel + '%';
        }
        
        // 更新情感状态
        if (emotionalState) {
            const emotionMap = {
                'friendly': '友好',
                'suspicious': '怀疑',
                'excited': '兴奋',
                'calm': '冷静',
                'neutral': '中性'
            };
            
            emotionalState.textContent = emotionMap[intelligence.emotionalState] || '中性';
            emotionalState.className = 'emotional-' + intelligence.emotionalState;
        }
        
        // 更新学习数据数量
        if (learningCount) {
            learningCount.textContent = intelligence.learningData.length + '条';
        }
        
        // 更新记忆银行数量
        if (memoryCount) {
            memoryCount.textContent = intelligence.memoryBank.length + '条';
        }
        
        // 更新沟通风格
        if (communicationStyle) {
            const styleMap = {
                'formal': '正式',
                'casual': '随意',
                'aggressive': '激进',
                'polite': '礼貌',
                'unknown': '未知'
            };
            
            const style = intelligence.userProfile.communicationStyle;
            communicationStyle.textContent = styleMap[style] || '未知';
            communicationStyle.className = 'style-' + style;
        }
    }
}

// 语音合成
function speakText(text) {
    if (!speechSynthesis || isSpeaking) return;
    
    // 停止当前播放
    speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    if (voiceSettings.selectedVoice) {
        utterance.voice = voiceSettings.selectedVoice;
    }
    
    utterance.rate = voiceSettings.rate;
    utterance.pitch = voiceSettings.pitch;
    utterance.volume = voiceSettings.volume;
    
    utterance.onstart = () => {
        isSpeaking = true;
        showSpeakingIndicator(true);
    };
    
    utterance.onend = () => {
        isSpeaking = false;
        showSpeakingIndicator(false);
    };
    
    utterance.onerror = () => {
        isSpeaking = false;
        showSpeakingIndicator(false);
    };
    
    speechSynthesis.speak(utterance);
}

// 显示说话指示器
function showSpeakingIndicator(speaking) {
    const aiMouth = document.getElementById('aiMouth');
    const speakingIndicator = document.getElementById('speakingIndicator');
    
    if (speaking) {
        aiMouth.classList.add('speaking');
        speakingIndicator.classList.add('active');
    } else {
        aiMouth.classList.remove('speaking');
        speakingIndicator.classList.remove('active');
    }
}

// 播放消息语音
function speakMessage(button) {
    const messageContent = button.parentElement.querySelector('.message-content');
    const text = messageContent.textContent.replace(/^(AI:|你:)\s*/, '');
    
    if (isSpeaking) {
        speechSynthesis.cancel();
        button.classList.remove('speaking');
        return;
    }
    
    button.classList.add('speaking');
    speakText(text);
    
    // 监听语音结束
    const checkSpeaking = setInterval(() => {
        if (!isSpeaking) {
            button.classList.remove('speaking');
            clearInterval(checkSpeaking);
        }
    }, 100);
}

// 切换语音输入
function toggleVoiceInput() {
    if (!speechRecognition) {
        alert('您的浏览器不支持语音识别功能');
        return;
    }
    
    if (isListening) {
        speechRecognition.stop();
    } else {
        speechRecognition.start();
    }
}

// 打开设置
function openSettings() {
    document.getElementById('settingsModal').style.display = 'block';
}

// 关闭设置
function closeSettings() {
    document.getElementById('settingsModal').style.display = 'none';
}

// 更新语音选择
function updateVoiceSelection() {
    const select = document.getElementById('voiceSelect');
    const selectedOption = select.options[select.selectedIndex];
    
    if (selectedOption && selectedOption.hasAttribute('data-voice')) {
        voiceSettings.selectedVoice = JSON.parse(selectedOption.getAttribute('data-voice'));
    }
}

// 更新语速
function updateSpeed() {
    const speedRange = document.getElementById('speedRange');
    const speedValue = document.getElementById('speedValue');
    voiceSettings.rate = parseFloat(speedRange.value);
    speedValue.textContent = speedRange.value;
}

// 更新音调
function updatePitch() {
    const pitchRange = document.getElementById('pitchRange');
    const pitchValue = document.getElementById('pitchValue');
    voiceSettings.pitch = parseFloat(pitchRange.value);
    pitchValue.textContent = pitchRange.value;
}

// 更新音量
function updateVolume() {
    const volumeRange = document.getElementById('volumeRange');
    const volumeValue = document.getElementById('volumeValue');
    voiceSettings.volume = parseFloat(volumeRange.value);
    volumeValue.textContent = volumeRange.value;
}

// 测试语音


// 显示游戏结束
function showGameEnd(success) {
    const modal = document.getElementById('gameModal');
    const title = document.getElementById('modalTitle');
    const message = document.getElementById('modalMessage');
    
    if (success) {
        title.textContent = '恭喜逃脱成功！';
        message.textContent = '你成功找回了自己的身份并逃离了ECHO系统。Dr. Alex Chen，欢迎回到现实世界！';
    } else {
        title.textContent = '游戏结束';
        message.textContent = '你未能成功逃脱ECHO系统。不要放弃，再试一次！';
    }
    
    modal.style.display = 'block';
}

// 保存游戏进度








// 显示通知
function showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // 添加样式
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: bold;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    // 根据类型设置背景色
    switch (type) {
        case 'success':
            notification.style.background = 'linear-gradient(45deg, #00ff00, #00cc00)';
            break;
        case 'error':
            notification.style.background = 'linear-gradient(45deg, #ff0000, #cc0000)';
            break;
        case 'warning':
            notification.style.background = 'linear-gradient(45deg, #ffaa00, #ff8800)';
            break;
        default:
            notification.style.background = 'linear-gradient(45deg, #00ffff, #0088ff)';
    }
    
    document.body.appendChild(notification);
    
    // 3秒后自动移除
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}





// 添加通知动画样式
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// 页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', initGame);

// 页面卸载时停止语音
window.addEventListener('beforeunload', () => {
    if (speechSynthesis) {
        speechSynthesis.cancel();
    }
    if (speechRecognition && isListening) {
        speechRecognition.stop();
    }
});