// --- Tab Management Functions ---
        
        // Generic function for the main data tabs
        function openTab(evt, tabName) {
            // Hide all tab content
            const tabcontent = document.getElementsByClassName("tab-content");
            for (let i = 0; i < tabcontent.length; i++) {
                tabcontent[i].style.display = "none";
            }
            
            // Deactivate all tab links
            const tablinks = document.getElementsByClassName("tab-link");
            for (let i = 0; i < tablinks.length; i++) {
                tablinks[i].className = tablinks[i].className.replace(" active", "");
            }
            
            // Show the current tab and add an "active" class to the button
            document.getElementById(tabName).style.display = "block";
            evt.currentTarget.className += " active";
        }

        // Specific function for the text area tabs
        function openTextTab(evt, tabName) {
            const tabcontent = document.getElementsByClassName("text-tab-content");
            for (let i = 0; i < tabcontent.length; i++) {
                tabcontent[i].style.display = "none";
            }
            const tablinks = document.getElementsByClassName("text-tab-link");
            for (let i = 0; i < tablinks.length; i++) {
                tablinks[i].className = tablinks[i].className.replace(" active", "");
            }
            document.getElementById(tabName).style.display = "block";
            evt.currentTarget.className += " active";
        }

        // Wait for the DOM to be fully loaded
        document.addEventListener('DOMContentLoaded', () => {
            const checkButton = document.getElementById('checkButton');
            const clearButton = document.getElementById('clearButton');
            const resultsContainer = document.getElementById('resultsContainer');

            // --- Event Listeners ---
            checkButton.addEventListener('click', performCheck);
            clearButton.addEventListener('click', clearAll);

            // --- Core Functions ---

            /**
             * Main function to perform the data verification.
             */
            function performCheck() {
                resultsContainer.innerHTML = ''; // Clear previous results

                // Step 1: Get the list of selected platforms from the checkboxes
                const selectedPlatforms = Array.from(document.querySelectorAll('#platformSelector input:checked')).map(cb => cb.value);

                if (selectedPlatforms.length === 0) {
                    alert('Por favor, selecciona al menos una plataforma para verificar.');
                    return;
                }

                // Step 2: Find the active text tab and get its content
                const activeTextTab = document.querySelector('.text-tab-content[style*="block"]');
                const textToSearch = activeTextTab.querySelector('textarea').value;

                if (textToSearch.trim() === '') {
                    alert('Por favor, pega el texto a verificar en el área de texto activa.');
                    return;
                }

                // Step 3: Find the active data tab to get the data from
                const activeDataTab = document.querySelector('.tab-content[style*="block"]');
                const dataRows = activeDataTab.querySelectorAll('tbody tr');
                const activeDataTabName = document.querySelector('.tab-link.active').textContent;
                
                let missingDataCount = 0;

                // Step 4: Iterate over each data row (Mac, Win, etc.)
                dataRows.forEach(row => {
                    const platformName = row.cells[0].textContent;

                    // Step 5: IMPORTANT - Only check platforms that were selected by the user
                    if (selectedPlatforms.includes(platformName)) {
                        const input = row.querySelector('input[type="text"]');
                        const dataToFind = input.value.trim();
                        
                        // Check for data only if the input field is not empty
                        if (dataToFind !== '' && !textToSearch.includes(dataToFind)) {
                            missingDataCount++;
                            const message = `${platformName} - ${activeDataTabName} ("${dataToFind}") no encontrado`;
                            createTag(message, 'tag-not-found');
                        }
                    }
                });
                
                // If after all checks on selected platforms, no data was missing, show a success message
                if (missingDataCount === 0) {
                    createTag(`¡Éxito! Todos los datos de ${activeDataTabName} para las plataformas seleccionadas fueron encontrados.`, 'tag-success');
                }
            }

            /**
             * Clears the text areas and the results.
             */
            function clearAll() {
                document.querySelectorAll('textarea').forEach(area => area.value = '');
                resultsContainer.innerHTML = '';
            }

            /**
             * Helper function to create and append a result tag.
             * @param {string} text - The message to display in the tag.
             * @param {string} className - The CSS class to apply for styling.
             */
            function createTag(text, className) {
                const tagElement = document.createElement('span');
                tagElement.textContent = text;
                tagElement.className = `tag ${className}`; // Use className for compatibility
                resultsContainer.appendChild(tagElement);
            }
        });

// script.js

// 1) Reglas: qué campos necesita cada plataforma
const requiredByPlatform = {
    Mac: ['Data1', 'Data2', 'Data3', 'Data4'],
    Windows: ['Data1', 'Data2', 'DataX'],
    Linux: ['Data1', 'Data3'],
  };
  
  // Helpers
  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  
  // Comprueba si el texto contiene el campo (word-boundary, case-insensitive)
  function hasField(text, field) {
    const pattern = new RegExp(`\\b${escapeRegex(field)}\\b`, 'i');
    return pattern.test(text);
  }
  
  // Extrae lista de campos faltantes dada plataforma y texto
  function missingFieldsFor(platform, text) {
    const required = requiredByPlatform[platform] || [];
    return required.filter(field => !hasField(text, field));
  }
  
  // DOM
  const platformSelect = document.getElementById('platform');
  const dataTextarea = document.getElementById('dataField');
  const checkBtn = document.getElementById('checkBtn');
  const resultDiv = document.getElementById('result');
  
  function renderResult(missing) {
    if (!missing || missing.length === 0) {
      resultDiv.innerHTML = `<p style="color: green;">✅ Todo presente</p>`;
      checkBtn.disabled = false;
    } else {
      resultDiv.innerHTML = `<p style="color: darkred;">Faltan: ${missing.join(', ')}</p>`;
      checkBtn.disabled = true;
    }
  }
  
  // Core: realiza la comprobación
  function runCheck() {
    const platform = platformSelect.value;
    const text = dataTextarea.value || '';
  
    if (!platform) {
      resultDiv.innerHTML = `<p style="color: gray;">Selecciona una plataforma.</p>`;
      checkBtn.disabled = true;
      return;
    }
  
    const missing = missingFieldsFor(platform, text);
    renderResult(missing);
  }
  
  // Debounce util
  function debounce(fn, wait = 300) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }
  
  // Listeners
  platformSelect.addEventListener('change', runCheck);
  dataTextarea.addEventListener('input', debounce(runCheck, 250));
  checkBtn.addEventListener('click', runCheck);
  
  // Fallback: polling ligero para detectar cambios si el contenido se escribe programáticamente
  let lastValue = dataTextarea.value;
  setInterval(() => {
    if (dataTextarea.value !== lastValue) {
      lastValue = dataTextarea.value;
      runCheck();
    }
  }, 700); // ajustable: 500-1000ms suele estar bien
  