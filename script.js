   const wrapper = document.getElementById('wrapper');
        const searchInput = document.getElementById('searchInput');
        const infoText = document.querySelector('.info-text');
        const synonyms = document.querySelector('.synonyms .list');
        const soundBtn = document.getElementById('soundBtn');
        const themeToggle = document.getElementById('themeToggle');
        const historyBtn = document.getElementById('historyBtn');
        const historySidebar = document.getElementById('historySidebar');
        const closeSidebar = document.getElementById('closeSidebar');
        const overlay = document.getElementById('overlay');
        const searchHistory = document.getElementById('searchHistory');
        const clearHistory = document.getElementById('clearHistory');

        let searchHistoryArray = JSON.parse(localStorage.getItem('searchHistory')) || [];
        let currentAudio = null;

       
        function search(word) {
            const api = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
            
            fetch(api)
                .then(response => response.json())
                .then(result => {
                    if (result.title) {
                        infoText.innerHTML = `Can't find the meaning of <span>"${word}"</span>. Please, try to search for another word.`;
                        wrapper.classList.remove('active');
                    } else {
                        displayResult(result[0]);
                        wrapper.classList.add('active');
                        addToHistory(word);
                    }
                })
                .catch(() => {
                    infoText.innerHTML = `Can't find the meaning of <span>"${word}"</span>. Please, try to search for another word.`;
                    wrapper.classList.remove('active');
                });
        }

        function displayResult(result) {
            const wordElement = document.querySelector('.word .details p');
            const phoneticElement = document.querySelector('.word .details span');
            const meaningElement = document.querySelector('.meaning .details span');
            const exampleElement = document.querySelector('.example .details span');

            wordElement.innerText = result.word;
            phoneticElement.innerText = result.phonetic || '';
            meaningElement.innerText = result.meanings[0].definitions[0].definition;
            exampleElement.innerText = result.meanings[0].definitions[0].example || 'No example available';

           
            synonyms.innerHTML = '';

           
            if (result.meanings[0].synonyms && result.meanings[0].synonyms.length > 0) {
                result.meanings[0].synonyms.slice(0, 5).forEach(synonym => {
                    const span = document.createElement('span');
                    span.innerText = synonym;
                    span.addEventListener('click', () => {
                        searchInput.value = synonym;
                        search(synonym);
                    });
                    synonyms.appendChild(span);
                });
            } else {
                synonyms.innerHTML = '<span>No synonyms available</span>';
            }

           
            if (result.phonetics) {
                const audioObj = result.phonetics.find(phonetic => phonetic.audio);
                if (audioObj) {
                    currentAudio = new Audio(audioObj.audio);
                }
            }
        }

        
        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter' && searchInput.value.trim()) {
                search(searchInput.value.trim());
            }
        });

        soundBtn.addEventListener('click', () => {
            if (currentAudio) {
                currentAudio.play();
            }
        });

        
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            themeToggle.textContent = isDark ? '☀️' : '🌙';
            localStorage.setItem('darkMode', isDark);
        });

       
        if (localStorage.getItem('darkMode') === 'true') {
            document.body.classList.add('dark-mode');
            themeToggle.textContent = '☀️';
        }

       
        function addToHistory(word) {
            if (!searchHistoryArray.includes(word)) {
                searchHistoryArray.unshift(word);
                if (searchHistoryArray.length > 20) {
                    searchHistoryArray.pop();
                }
                localStorage.setItem('searchHistory', JSON.stringify(searchHistoryArray));
                updateHistoryDisplay();
            }
        }

        function updateHistoryDisplay() {
            searchHistory.innerHTML = '';
            searchHistoryArray.forEach(word => {
                const span = document.createElement('span');
                span.textContent = word;
                span.addEventListener('click', () => {
                    searchInput.value = word;
                    search(word);
                    closeSidebarPanel();
                });
                searchHistory.appendChild(span);
            });
        }

        function openSidebarPanel() {
            historySidebar.classList.add('active');
            overlay.classList.add('active');
        }

        function closeSidebarPanel() {
            historySidebar.classList.remove('active');
            overlay.classList.remove('active');
        }

       
        historyBtn.addEventListener('click', openSidebarPanel);
        closeSidebar.addEventListener('click', closeSidebarPanel);
        overlay.addEventListener('click', closeSidebarPanel);

        clearHistory.addEventListener('click', () => {
            searchHistoryArray = [];
            localStorage.removeItem('searchHistory');
            updateHistoryDisplay();
        });

      
        updateHistoryDisplay();

      
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeSidebarPanel();
            }
        });
 
