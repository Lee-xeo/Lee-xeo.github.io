// 主题切换 + 页脚年份。内容已内联在各语言的 HTML 中，无需再从 JSON 加载。
document.addEventListener('DOMContentLoaded', () => {
    const THEMES = [
        { name: 'Light', colors: {
            '--bg-color': '#ffffff', '--text-color': '#333333', '--heading-color': '#111111',
            '--accent-color': '#0056b3', '--secondary-bg-color': '#f8f9fa', '--border-color': '#dee2e6'
        }},
        { name: 'Dark', colors: {
            '--bg-color': '#1a1a2e', '--text-color': '#e0e0e0', '--heading-color': '#ffffff',
            '--accent-color': '#76a9ff', '--secondary-bg-color': '#16213e', '--border-color': '#2a3b5c'
        }},
        { name: 'Sepia', colors: {
            '--bg-color': '#fbf0d9', '--text-color': '#5b4636', '--heading-color': '#3d2c1d',
            '--accent-color': '#8d6e63', '--secondary-bg-color': '#f5e5c5', '--border-color': '#dcd0b9'
        }}
    ];

    const container = document.getElementById('theme-switcher');
    let currentTheme = localStorage.getItem('theme') || 'Light';

    function applyTheme(name) {
        const theme = THEMES.find(t => t.name === name);
        if (!theme) return;
        for (const [key, value] of Object.entries(theme.colors)) {
            document.documentElement.style.setProperty(key, value);
        }
        if (container) {
            container.querySelectorAll('.theme-button').forEach((btn, i) => {
                btn.classList.toggle('active', THEMES[i].name === name);
            });
        }
    }

    if (container) {
        THEMES.forEach(theme => {
            const btn = document.createElement('button');
            btn.className = 'theme-button';
            btn.title = theme.name;
            btn.style.backgroundColor = theme.colors['--accent-color'];
            btn.addEventListener('click', () => {
                currentTheme = theme.name;
                localStorage.setItem('theme', currentTheme);
                applyTheme(currentTheme);
            });
            container.appendChild(btn);
        });
        applyTheme(currentTheme);
    }

    const yearEl = document.getElementById('current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
});
