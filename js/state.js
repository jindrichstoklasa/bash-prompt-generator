// Global State
        let elements = [];
        let selectedElements = new Set();
        let elementIdCounter = 0;

        function isMobileViewport() {
            return window.innerWidth <= 768;
        }

        let lastMobileState = isMobileViewport();

