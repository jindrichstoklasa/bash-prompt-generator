function openPropertiesDrawer() {
            if (!isMobileViewport()) return;
            const panel = document.querySelector('.right-panel');
            if (panel) panel.classList.add('mobile-open');
        }

        function closePropertiesDrawer() {
            const panel = document.querySelector('.right-panel');
            if (panel) panel.classList.remove('mobile-open');
        }

        // Render Elements Panel
        function renderElementsPanel() {
            const panel = document.getElementById('elementsPanel');
            panel.innerHTML = '';

            for (const [category, items] of Object.entries(ELEMENT_CATEGORIES)) {
                if (category === 'Formatting' || category === 'Icons / Symbols') continue;
                const categoryDiv = document.createElement('div');
                categoryDiv.className = 'category';

                const titleDiv = document.createElement('div');
                titleDiv.className = 'category-title';
                titleDiv.textContent = category;
                categoryDiv.appendChild(titleDiv);

                const gridDiv = document.createElement('div');
                gridDiv.className = 'elements-grid';

                for (const item of items) {
                    const btn = document.createElement('button');
                    btn.className = 'element-btn';
                    btn.textContent = item.name;
                    btn.title = item.name;
                    btn.onclick = () => addElement(item);
                    if (!isMobileViewport()) {
                        btn.draggable = true;
                        btn.setAttribute('data-element', JSON.stringify({ id: item.id, name: item.name, code: item.code, preview: item.preview }));
                        btn.ondragstart = (e) => {
                            e.dataTransfer.setData('application/json', e.target.getAttribute('data-element'));
                            e.dataTransfer.effectAllowed = 'copy';
                        };
                    }
                    gridDiv.appendChild(btn);
                }

                categoryDiv.appendChild(gridDiv);
                panel.appendChild(categoryDiv);
            }
        }

        // Render Special Characters
        function renderSpecialChars() {
            const container = document.getElementById('specialChars');
            container.innerHTML = '';

            SPECIAL_CHARS.forEach(spec => {
                const btn = document.createElement('button');
                btn.className = 'char-btn';
                btn.textContent = spec.char;
                btn.title = spec.char;
                const def = { id: 'char_' + Math.random(), name: spec.char, code: spec.code, preview: spec.char === 'Space' ? ' ' : spec.code };
                btn.onclick = () => addElement(def);
                if (!isMobileViewport()) {
                    btn.draggable = true;
                    btn.setAttribute('data-element', JSON.stringify(def));
                    btn.ondragstart = (e) => {
                        e.dataTransfer.setData('application/json', e.target.getAttribute('data-element'));
                        e.dataTransfer.effectAllowed = 'copy';
                    };
                }
                container.appendChild(btn);
            });
        }

        // Render Canvas
        function renderCanvas() {
            const canvas = document.getElementById('canvas');
            canvas.innerHTML = '';

            if (elements.length === 0) {
                const empty = document.createElement('div');
                empty.className = 'canvas-empty';
                if (isMobileViewport()) {
                    empty.innerHTML = `
                        <div class="canvas-empty-text">Add elements by tapping them in Prompt Elements above</div>
                    `;
                } else {
                    empty.innerHTML = `
                        <div class="canvas-empty-text">Drop elements here</div>
                        <div class="canvas-hint">or click on elements in the left panel to add</div>
                    `;
                }
                canvas.appendChild(empty);
                return;
            }

            const sortableList = document.createElement('div');
            sortableList.id = 'sortable-list';

            elements.forEach((elem, index) => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'element-item' + (selectedElements.has(elem.id) ? ' selected' : '');
                itemDiv.draggable = true;
                itemDiv.dataset.elemId = elem.id;

                const styles = generateElementStyles(elem);

                itemDiv.innerHTML = `
                    <div class="element-content">
                        <span class="element-label">${elem.name}</span>
                        <span class="element-preview" style="${styles}">${elem.preview}</span>
                    </div>
                    <div class="element-actions">
                        <button class="btn-icon" title="Duplicate" onclick="event.stopPropagation(); duplicateElement('${elem.id}')">
                            <i class="fas fa-copy"></i>
                        </button>
                        <button class="btn-icon" title="Delete" onclick="event.stopPropagation(); deleteElement('${elem.id}')">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `;

                itemDiv.onclick = (e) => {
                    if (e.target.closest('.element-actions') || e.target.closest('.btn-icon')) {
                        return;
                    }

                    if (isMobileViewport()) {
                        selectedElements.clear();
                        selectedElements.add(elem.id);
                    } else {
                        if (selectedElements.has(elem.id)) {
                            selectedElements.delete(elem.id);
                        } else {
                            selectedElements.add(elem.id);
                        }
                    }
                    renderCanvas();
                    renderPropertiesPanel();
                    if (selectedElements.size > 0) openPropertiesDrawer();
                };

                sortableList.appendChild(itemDiv);
            });

            canvas.appendChild(sortableList);

            // Initialize Sortable
            Sortable.create(sortableList, {
                animation: 150,
                ghostClass: 'sortable-ghost',
                onEnd: () => {
                    const newOrder = Array.from(sortableList.children)
                        .map(div => elements.find(e => e.id === div.dataset.elemId))
                        .filter(Boolean);

                    if (newOrder.length === elements.length) {
                        elements = newOrder;
                    }

                    // Force a full re-render so mobile canvas order visually matches preview/state.
                    renderCanvas();
                    updatePreview();
                }
            });
        }

        // Render Properties Panel
        function renderPropertiesPanel() {
            const panel = document.getElementById('propertiesPanel');

            if (selectedElements.size === 0) {
                panel.innerHTML = '<div class="no-selection">Select an element to edit properties</div>';
                closePropertiesDrawer();
                return;
            }

            const selectedArray = Array.from(selectedElements).map(id => elements.find(e => e.id === id));
            panel.innerHTML = '';

            // Foreground Color
            const fgGroup = document.createElement('div');
            fgGroup.className = 'property-group';
            fgGroup.innerHTML = `
                <div class="property-label">Foreground Color</div>
                <div class="color-mode-tabs">
                    <button class="color-mode-tabs button active" onclick="switchColorMode('fg', 'hex')">Hex</button>
                    <button class="color-mode-tabs button" onclick="switchColorMode('fg', 'ansi')">ANSI</button>
                    <button class="color-mode-tabs button" onclick="switchColorMode('fg', 'truecolor')">True</button>
                </div>
                <div class="color-picker-group">
                    <input type="color" class="color-input" id="fgColorInput" 
                        value="${selectedArray[0]?.fgColor || '#00ff00'}"
                        onchange="updateSelectedElements('fgColor', this.value)">
                    <input type="text" class="color-value" id="fgValue" 
                        value="${selectedArray[0]?.fgColor || '#00ff00'}"
                        onchange="updateSelectedElements('fgColor', this.value)">
                </div>
                <div class="color-palette" id="fgPalette"></div>
            `;
            panel.appendChild(fgGroup);

            // Background Color
            const bgGroup = document.createElement('div');
            bgGroup.className = 'property-group';
            bgGroup.innerHTML = `
                <div class="property-label">Background Color</div>
                <div class="color-picker-group">
                    <input type="color" class="color-input" id="bgColorInput" 
                        value="${selectedArray[0]?.bgColor || '#000000'}"
                        onchange="updateSelectedElements('bgColor', this.value)">
                    <input type="text" class="color-value" id="bgValue" 
                        value="${selectedArray[0]?.bgColor || '#000000'}"
                        onchange="updateSelectedElements('bgColor', this.value)">
                </div>
                <div class="color-palette" id="bgPalette"></div>
            `;
            panel.appendChild(bgGroup);

            // Text Attributes
            const attrsGroup = document.createElement('div');
            attrsGroup.className = 'property-group';
            attrsGroup.innerHTML = `
                <div class="property-label">Text Attributes</div>
                <div class="attributes-grid">
                    <div class="attr-checkbox">
                        <input type="checkbox" id="boldAttr" 
                            ${selectedArray[0]?.bold ? 'checked' : ''} 
                            onchange="updateSelectedElements('bold', this.checked)">
                        <label for="boldAttr"><strong>Bold</strong></label>
                    </div>
                    <div class="attr-checkbox">
                        <input type="checkbox" id="dimAttr" 
                            ${selectedArray[0]?.dim ? 'checked' : ''} 
                            onchange="updateSelectedElements('dim', this.checked)">
                        <label for="dimAttr"><em>Dim</em></label>
                    </div>
                    <div class="attr-checkbox">
                        <input type="checkbox" id="italicAttr" 
                            ${selectedArray[0]?.italic ? 'checked' : ''} 
                            onchange="updateSelectedElements('italic', this.checked)">
                        <label for="italicAttr"><i>Italic</i></label>
                    </div>
                    <div class="attr-checkbox">
                        <input type="checkbox" id="underlineAttr" 
                            ${selectedArray[0]?.underline ? 'checked' : ''} 
                            onchange="updateSelectedElements('underline', this.checked)">
                        <label for="underlineAttr"><u>Underline</u></label>
                    </div>
                    <div class="attr-checkbox">
                        <input type="checkbox" id="blinkAttr" 
                            ${selectedArray[0]?.blink ? 'checked' : ''} 
                            onchange="updateSelectedElements('blink', this.checked)">
                        <label for="blinkAttr">Blink</label>
                    </div>
                    <div class="attr-checkbox">
                        <input type="checkbox" id="invertedAttr" 
                            ${selectedArray[0]?.inverted ? 'checked' : ''} 
                            onchange="updateSelectedElements('inverted', this.checked)">
                        <label for="invertedAttr">Inverted</label>
                    </div>
                </div>
            `;
            panel.appendChild(attrsGroup);

            // Action Buttons (side by side)
            const actionsGroup = document.createElement('div');
            actionsGroup.className = 'property-group';
            actionsGroup.innerHTML = `
                <div class="property-actions-row">
                    <button class="btn-primary" onclick="duplicateSelectedElements()" title="Duplicate Selected">
                        <i class="fas fa-copy"></i> Duplicate
                    </button>
                    <button class="btn-danger" onclick="deleteSelectedElements()" title="Delete Selected">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            `;
            panel.appendChild(actionsGroup);

            renderColorPalette('fgPalette', 'fgColor');
            renderColorPalette('bgPalette', 'bgColor');
        }

        // Render Color Palette
        function renderColorPalette(paletteId, property) {
            const palette = document.getElementById(paletteId);
            const colors = [
                '#000000', '#ff0000', '#00ff00', '#ffff00',
                '#0000ff', '#ff00ff', '#00ffff', '#ffffff',
                '#808080', '#ff6b6b', '#51cf66', '#ffd43b'
            ];

            colors.forEach(color => {
                const swatch = document.createElement('div');
                swatch.className = 'color-swatch';
                swatch.style.backgroundColor = color;
                swatch.onclick = () => {
                    updateSelectedElements(property, color);
                    renderPropertiesPanel();
                };
                palette.appendChild(swatch);
            });
        }

        function togglePanel(panelType) {
            if (panelType === 'right' && isMobileViewport()) {
                const rightPanel = document.querySelector('.right-panel');
                if (rightPanel) rightPanel.classList.toggle('mobile-open');
                return;
            }

            if (panelType === 'left' && isMobileViewport()) {
                const leftPanel = document.querySelector('.left-panel');
                if (!leftPanel) return;

                leftPanel.classList.toggle('collapsed');
                const leftToggle = document.querySelectorAll('.panel-toggle')[0];
                if (leftToggle) {
                    const isCollapsed = leftPanel.classList.contains('collapsed');
                    leftToggle.innerHTML = `<i class="fas fa-chevron-${isCollapsed ? 'down' : 'up'}"></i> Prompt Elements`;
                }
                return;
            }

            const panel = panelType === 'left' ? document.querySelector('.left-panel') : document.querySelector('.right-panel');
            const toggle = panelType === 'left' ? document.querySelectorAll('.panel-toggle')[0] : document.querySelectorAll('.panel-toggle')[1];

            panel.classList.toggle('active');

            if (toggle) {
                if (panel.classList.contains('active')) {
                    toggle.innerHTML = `<i class="fas fa-chevron-up"></i> ${panelType === 'left' ? 'Prompt Elements' : 'Element Properties'}`;
                } else {
                    toggle.innerHTML = `<i class="fas fa-chevron-down"></i> ${panelType === 'left' ? 'Prompt Elements' : 'Element Properties'}`;
                }
            }
        }



