document.addEventListener('DOMContentLoaded', () => {
    let contentData = {};
    let themesData = [];
    let currentLang = localStorage.getItem('lang') || 'en';
    let currentTheme = localStorage.getItem('theme') || 'Light';

    const langButtons = {
        en: document.getElementById('lang-en'),
        zh: document.getElementById('lang-zh')
    };
    const themeSwitcherContainer = document.getElementById('theme-switcher');
    const publicationsList = document.getElementById('publications-list');

    async function loadData() {
        try {
            const contentResponse = await fetch('assets/config/content.json');
            contentData = await contentResponse.json();

            const themesResponse = await fetch('assets/config/themes.json');
            themesData = await themesResponse.json();
            
            initializePage();
        } catch (error) {
            console.error('Error loading configuration files:', error);
        }
    }

    function initializePage() {
        setupThemeSwitcher();
        applyTheme(currentTheme);
        applyLanguage(currentLang);
        setupEventListeners();
        updateFooterYear();
    }

    function setupThemeSwitcher() {
        themesData.forEach(theme => {
            const button = document.createElement('button');
            button.className = 'theme-button';
            button.title = theme.name;
            button.style.backgroundColor = theme.colors['--accent-color'];
            button.addEventListener('click', () => {
                currentTheme = theme.name;
                localStorage.setItem('theme', currentTheme);
                applyTheme(currentTheme);
            });
            themeSwitcherContainer.appendChild(button);
        });
    }

    function applyTheme(themeName) {
        const theme = themesData.find(t => t.name === themeName);
        if (!theme) return;

        for (const [key, value] of Object.entries(theme.colors)) {
            document.documentElement.style.setProperty(key, value);
        }

        // Update active button state
        const buttons = themeSwitcherContainer.querySelectorAll('.theme-button');
        buttons.forEach((button, index) => {
            if (themesData[index].name === themeName) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }

    function applyLanguage(lang) {
        const langContent = contentData[lang];
        if (!langContent) return;

        document.querySelectorAll('[data-lang-key]').forEach(element => {
            const key = element.getAttribute('data-lang-key');
            if (langContent[key]) {
                let text = langContent[key];

                // 使用正则表达式查找所有 [文本](链接) 格式并替换为 <a> 标签
                const linkRegex = /\[(.*?)\]\((.*?)\)/g;
                const processedText = text.replace(linkRegex, '<a href="$2" target="_blank">$1</a>');
                // 替换换行符为 <br> 标签
                const finalText = processedText.replace(/\n/g, '<br>');
                element.innerHTML = finalText;
            }
        });

        renderPublications(langContent.publications);
        updateActiveLangButton(lang);
    }
    
    function renderPublications(publications) {
        publicationsList.innerHTML = '';
        publications.forEach(pub => {
            const linksHTML = Object.entries(pub.links).map(([name, url]) => 
                `<a href="${url}" target="_blank">${name}</a>`
            ).join('');

            const listItem = `
                <li>
                    <p class="pub-title">${pub.title}</p>
                    <p class="pub-authors">${pub.authors.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</p>
                    <p class="pub-venue">${pub.venue}</p>
                    <div class="pub-links">${linksHTML}</div>
                </li>
            `;
            publicationsList.innerHTML += listItem;
        });
    }

    function updateActiveLangButton(lang) {
        Object.values(langButtons).forEach(button => button.classList.remove('active'));
        if (langButtons[lang]) {
            langButtons[lang].classList.add('active');
        }
    }

    function setupEventListeners() {
        langButtons.en.addEventListener('click', () => switchLanguage('en'));
        langButtons.zh.addEventListener('click', () => switchLanguage('zh'));
    }

    function switchLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('lang', lang);
        applyLanguage(lang);
    }

    function updateFooterYear() {
        document.getElementById('current-year').textContent = new Date().getFullYear();
    }

    loadData();
});
