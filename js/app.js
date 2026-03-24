// Theme Toggle
        function toggleTheme() {
            const html = document.documentElement;
            const isDark = html.classList.contains('dark');
            if (isDark) {
                html.classList.remove('dark');
                localStorage.setItem('theme', 'light');
            } else {
                html.classList.add('dark');
                localStorage.setItem('theme', 'dark');
            }
            updateThemeToggle();
        }

        function updateThemeToggle() {
            const sw = document.getElementById('themeSwitch');
            if (!sw) return;
            const isDark = document.documentElement.classList.contains('dark');
            sw.title = isDark ? 'Switch to light theme' : 'Switch to dark theme';
            sw.setAttribute('aria-checked', isDark ? 'false' : 'true');
        }

// Initialize App
        function init() {
            updateThemeToggle();
            renderElementsPanel();
            renderSpecialChars();
            renderCanvas();
            renderPropertiesPanel();
            updatePreview();
            setupCanvasDropZone();
            setupButtonHandlers();
        }

        // Setup Button Handlers
        function setupButtonHandlers() {
            document.getElementById('copyBtn').onclick = () => {
                const code = document.getElementById('codeOutput').textContent;
                navigator.clipboard.writeText(code).then(() => {
                    const btn = document.getElementById('copyBtn');
                    btn.classList.add('copied');
                    btn.textContent = 'Copied!';
                    setTimeout(() => {
                        btn.classList.remove('copied');
                        btn.innerHTML = '<i class="fas fa-copy"></i> Copy to Clipboard';
                    }, 2000);
                });
            };

            document.getElementById('resetBtn').onclick = () => {
                if (confirm('Reset all element properties (colors and attributes) to defaults?')) {
                    elements.forEach(elem => {
                        elem.fgColor = '#00ff00';
                        elem.bgColor = 'transparent';
                        elem.bold = false;
                        elem.dim = false;
                        elem.italic = false;
                        elem.underline = false;
                        elem.blink = false;
                        elem.inverted = false;
                    });
                    renderCanvas();
                    renderPropertiesPanel();
                    updatePreview();
                }
            };

            document.getElementById('deleteBtn').onclick = () => {
                if (confirm('Are you sure you want to delete all elements?')) {
                    elements = [];
                    selectedElements.clear();
                    renderCanvas();
                    renderPropertiesPanel();
                    if (selectedElements.size === 0) closePropertiesDrawer();
                    updatePreview();
                }
            };
        }

        function initMobileResponsiveness() {
            const nowMobile = isMobileViewport();
            if (!nowMobile) closePropertiesDrawer();
            if (lastMobileState !== nowMobile) {
                lastMobileState = nowMobile;
                renderElementsPanel();
                renderSpecialChars();
            }
        }

        window.addEventListener('resize', initMobileResponsiveness);

        // Start the app after DOM is ready (scripts are loaded in <head>)
        window.addEventListener('DOMContentLoaded', () => {
            init();
            initMobileResponsiveness();
        });



