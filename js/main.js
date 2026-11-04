const chinese = document.documentElement.lang === 'zh-CN';
const themes = [
    { name: 'Light', label: chinese ? '浅色' : 'Light', swatch: '#fff' },
    { name: 'Dark', label: chinese ? '深色' : 'Dark', swatch: '#393445' },
    { name: 'Sepia', label: chinese ? '暖色' : 'Sepia', swatch: '#e2c9a6' }
];
const switcher = document.getElementById('theme-switcher');

function applyTheme(name) {
    document.documentElement.dataset.theme = name;
    for (const button of switcher.children) {
        button.setAttribute('aria-pressed', String(button.value === name));
    }
}

for (const theme of themes) {
    const button = document.createElement('button');
    button.className = 'theme-button';
    button.type = 'button';
    button.value = theme.name;
    button.title = theme.label;
    button.setAttribute('aria-label', theme.label);
    button.style.setProperty('--swatch', theme.swatch);
    button.addEventListener('click', () => {
        applyTheme(theme.name);
        try { localStorage.setItem('theme', theme.name); } catch { /* Storage is optional. */ }
    });
    switcher.append(button);
}

let saved;
try { saved = localStorage.getItem('theme'); } catch { /* Use the default theme. */ }
applyTheme(themes.some(theme => theme.name === saved) ? saved : 'Light');
document.getElementById('current-year').textContent = new Date().getFullYear();
