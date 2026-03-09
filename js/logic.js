// Add Element to Canvas (insertIndex = undefined means append at end)
        // Each instance gets unique id; templateId preserves type for preview/code.
        function addElement(elementDef, insertIndex) {
            const templateId = elementDef.id;
            const element = {
                ...elementDef,
                id: 'elem_' + (elementIdCounter++),
                templateId: templateId,
                fgColor: '#00ff00',
                bgColor: 'transparent',
                bold: false,
                dim: false,
                italic: false,
                underline: false,
                blink: false,
                inverted: false
            };

            if (insertIndex !== undefined && insertIndex >= 0 && insertIndex <= elements.length) {
                elements.splice(insertIndex, 0, element);
            } else {
                elements.push(element);
            }
            renderCanvas();
            updatePreview();
        }

        // Generate Element Styles
        function generateElementStyles(elem) {
            let style = 'padding-top: 10px; ';
            
            if (elem.bold) style += 'font-weight: bold; ';
            if (elem.dim) style += 'opacity: 0.6; ';
            if (elem.italic) style += 'font-style: italic; ';
            if (elem.underline) style += 'text-decoration: underline; ';
            if (elem.fgColor !== '#00ff00') style += `color: ${elem.fgColor}; `;
            if (elem.bgColor !== 'transparent') style += `background-color: ${elem.bgColor}; padding: 2px 4px; border-radius: 2px; `;

            return style;
        }

        // Generate ANSI code from element
        function generateAnsiCode(elem) {
            let code = '';

            // Color codes
            if (elem.fgColor && elem.fgColor !== '#00ff00') {
                const rgb = hexToRgb(elem.fgColor);
                code += `\\e[38;2;${rgb.r};${rgb.g};${rgb.b}m`;
            }

            if (elem.bgColor && elem.bgColor !== 'transparent') {
                const rgb = hexToRgb(elem.bgColor);
                code += `\\e[48;2;${rgb.r};${rgb.g};${rgb.b}m`;
            }

            // Text attributes
            if (elem.bold) code += '\\e[1m';
            if (elem.dim) code += '\\e[2m';
            if (elem.italic) code += '\\e[3m';
            if (elem.underline) code += '\\e[4m';
            if (elem.blink) code += '\\e[5m';
            if (elem.inverted) code += '\\e[7m';

            return code;
        }

        // Convert hex to RGB
        function hexToRgb(hex) {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : { r: 0, g: 255, b: 0 };
        }

        // Duplicate Element
        function duplicateElement(elemId) {
            const elem = elements.find(e => e.id === elemId);
            const copy = { ...elem, id: 'elem_' + (elementIdCounter++) };
            const index = elements.findIndex(e => e.id === elemId);
            elements.splice(index + 1, 0, copy);
            renderCanvas();
            updatePreview();
        }

        // Delete Element
        function deleteElement(elemId) {
            elements = elements.filter(e => e.id !== elemId);
            selectedElements.delete(elemId);
            renderCanvas();
            renderPropertiesPanel();
            if (selectedElements.size === 0) closePropertiesDrawer();
            updatePreview();
        }

        // Setup Canvas Drop Zone (PC: accept drop from Prompt Elements, support insert between)
        function setupCanvasDropZone() {
            const canvas = document.getElementById('canvas');

            canvas.addEventListener('dragover', (e) => {
                if (isMobileViewport()) return;
                e.preventDefault();
                e.dataTransfer.dropEffect = 'copy';
                canvas.classList.add('drag-over');
            });

            canvas.addEventListener('dragleave', (e) => {
                if (!canvas.contains(e.relatedTarget)) canvas.classList.remove('drag-over');
            });

            canvas.addEventListener('drop', (e) => {
                e.preventDefault();
                canvas.classList.remove('drag-over');
                if (isMobileViewport()) return;
                const json = e.dataTransfer.getData('application/json');
                if (!json) return;
                let def;
                try {
                    def = JSON.parse(json);
                } catch (err) {
                    return;
                }
                let insertIndex = elements.length;
                const target = e.target.closest('.element-item');
                if (target && target.dataset.elemId) {
                    const idx = elements.findIndex(el => el.id === target.dataset.elemId);
                    if (idx !== -1) {
                        const rect = target.getBoundingClientRect();
                        insertIndex = e.clientY < rect.top + rect.height / 2 ? idx : idx + 1;
                    }
                } else {
                    const sortableList = document.getElementById('sortable-list');
                    if (sortableList && sortableList.children.length) {
                        const children = Array.from(sortableList.children);
                        for (let i = 0; i < children.length; i++) {
                            const r = children[i].getBoundingClientRect();
                            if (e.clientY < r.top + r.height / 2) {
                                insertIndex = i;
                                break;
                            }
                            insertIndex = i + 1;
                        }
                    }
                }
                addElement(def, insertIndex);
            });
        }

        // Update Selected Elements
        function updateSelectedElements(property, value) {
            selectedElements.forEach(id => {
                const elem = elements.find(e => e.id === id);
                if (elem) {
                    elem[property] = value;
                    const input = document.getElementById(property === 'fgColor' ? 'fgColorInput' : property === 'bgColor' ? 'bgColorInput' : null);
                    const valueInput = document.getElementById(property === 'fgColor' ? 'fgValue' : property === 'bgColor' ? 'bgValue' : null);
                    if (input) input.value = value;
                    if (valueInput) valueInput.value = value;
                }
            });
            renderCanvas();
            updatePreview();
        }

        // Duplicate Selected Elements
        function duplicateSelectedElements() {
            const selectedArray = Array.from(selectedElements).map(id => elements.find(e => e.id === id));
            const copies = selectedArray.map(elem => ({
                ...elem,
                id: 'elem_' + (elementIdCounter++)
            }));
            elements.push(...copies);
            selectedElements.clear();
            renderCanvas();
            updatePreview();
        }

        // Delete Selected Elements
        function deleteSelectedElements() {
            selectedElements.forEach(id => {
                elements = elements.filter(e => e.id !== id);
            });
            selectedElements.clear();
            renderCanvas();
            renderPropertiesPanel();
            if (selectedElements.size === 0) closePropertiesDrawer();
            updatePreview();
        }

        // Update Preview
        function updatePreview() {
            const preview = document.getElementById('preview');
            const codeOutput = document.getElementById('codeOutput');

            let previewHtml = '';
            let promptCode = 'PS1="';

            elements.forEach(elem => {
                // Generate preview text with actual values (use templateId for type)
                const typeId = elem.templateId || elem.id;
                let previewValue = elem.preview;
                switch (typeId) {
                    case 'time24h':
                        previewValue = new Date().toLocaleTimeString('en-US', { hour12: false });
                        break;
                    case 'custom_date':
                        const d = new Date();
                        previewValue = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0') + ' ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0') + ':' + String(d.getSeconds()).padStart(2, '0');
                        break;
                    case 'date':
                        previewValue = new Date().toISOString().split('T')[0];
                        break;
                    case 'time12h':
                        previewValue = new Date().toLocaleTimeString('en-US', { hour12: true });
                        break;
                    case 'username':
                        previewValue = 'neiki';
                        break;
                    case 'pwd_full':
                        previewValue = '/home/neiki/projects';
                        break;
                    case 'pwd_name':
                        previewValue = 'projects';
                        break;
                    case 'hostname_short':
                        previewValue = 'mypc';
                        break;
                    case 'hostname_full':
                        previewValue = 'mypc.example.com';
                        break;
                    case 'git_branch':
                        previewValue = 'main';
                        break;
                }

                // Generate CSS for element styling
                let styles = generateElementStyles(elem);
                let styledPreview = `<span style="${styles}">${previewValue}</span>`;

                previewHtml += styledPreview;
                promptCode += elem.code;
            });

            if (elements.length > 0) {
                promptCode += '"';
            } else {
                promptCode = 'PS1=""';
            }

            // Add cursor to preview
            preview.innerHTML = previewHtml + (elements.length > 0 ? '<span style="animation: blink 1s infinite;">_</span>' : '');
            codeOutput.textContent = promptCode;
        }

        function switchColorMode(type, mode) {
            // Placeholder for color mode switching
            console.log(`Switching ${type} to ${mode} mode`);
        }

