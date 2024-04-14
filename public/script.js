function updateChatWindow(sender, message) {
    const chatWindow = document.getElementById('chatWindow');
    const messageDiv = document.createElement('div');
    messageDiv.textContent = `${sender}: ${message}`;
    chatWindow.appendChild(messageDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

async function sendMessage() {
    const userInputField = document.getElementById('userInput');
    const userMessage = userInputField.value;
    userInputField.value = '';

    updateChatWindow('You', userMessage);

    try {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userMessage })
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        updateChatWindow('ChatGPT', data.message);
    } catch (error) {
        console.error('Error sending message:', error);
        updateChatWindow('Error', 'Unable to send message.');
    }
}

document.getElementById('userInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// 
if (window.SpeechRecognition || window.webkitSpeechRecognition) {
    const startRecordBtn = document.getElementById('startRecordBtn');
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    startRecordBtn.addEventListener('click', () => {
        recognition.start();
    });

    recognition.addEventListener('result', (e) => {
        const transcript = e.results[0][0].transcript;
        document.getElementById('userInput').value = transcript;
        recognition.stop();
        sendMessage();
    });

    recognition.addEventListener('speechend', () => {
        recognition.stop();
    });

    recognition.addEventListener('error', (e) => {
        console.error('Error during the speech recognition:', e.error);
    });
} else {
    console.log('The browser does not support speech recognition.');
    // Optionally, hide the startRecordBtn or notify the user
}

function sendFeedback(feedbackType) {
    // Implementation remains the same
}

// 
window.onload = function() {
    const tutorialModal = document.getElementById('tutorialModal');
    if (tutorialModal) {
        tutorialModal.style.display = 'block';
    }
};

// 
function closeTutorial() {
    const tutorialModal = document.getElementById('tutorialModal');
    if (tutorialModal) {
        tutorialModal.style.display = 'none';
    }
}
