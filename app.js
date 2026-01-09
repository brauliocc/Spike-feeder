const defaultFoods = {
    crickets: 1,
    superworms: 5,
    hornworms: 10,
    dubia: 3,
    mealworms: 2
};

let settings = {
    weeklyGoal: 20,
    foods: { ...defaultFoods }
};

let quantities = {};

function loadSettings() {
    const saved = localStorage.getItem('spikeFeederSettings');
    if (saved) {
        settings = JSON.parse(saved);
    }
    for (const food in settings.foods) {
        quantities[food] = 0;
    }
    const savedQuantities = localStorage.getItem('spikeFeederQuantities');
    if (savedQuantities) {
        quantities = JSON.parse(savedQuantities);
    }
}

function saveSettings() {
    localStorage.setItem('spikeFeederSettings', JSON.stringify(settings));
}

function saveQuantities() {
    localStorage.setItem('spikeFeederQuantities', JSON.stringify(quantities));
}

function formatFoodName(name) {
    return name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' $1');
}

function renderFoodInputs() {
    const container = document.getElementById('food-list');
    container.innerHTML = '';
    
    for (const food in settings.foods) {
        const qty = quantities[food] || 0;
        const div = document.createElement('div');
        div.className = 'food-item';
        div.innerHTML = `
            <span class="food-label">${formatFoodName(food)}</span>
            <div class="controls">
                <button class="control-btn" onclick="changeQty('${food}', -1)">-</button>
                <span class="qty-display" id="display-${food}">${qty}</span>
                <button class="control-btn" onclick="changeQty('${food}', 1)">+</button>
            </div>
        `;
        container.appendChild(div);
    }
}

function changeQty(food, delta) {
    const current = quantities[food] || 0;
    const next = Math.max(0, current + delta);
    quantities[food] = next;
    document.getElementById(`display-${food}`).textContent = next;
    saveQuantities();
    updateDisplay();
}

function calculateTotal() {
    let total = 0;
    for (const [food, qty] of Object.entries(quantities)) {
        const value = settings.foods[food] || 0;
        total += qty * value;
    }
    return total;
}

function updateDisplay() {
    const total = calculateTotal();
    const goal = settings.weeklyGoal;
    
    const percentage = (total / goal) * 100;
    const progressFill = document.getElementById('progress-fill');
    progressFill.style.width = `${Math.min(percentage, 100)}%`;
    
    // Update ticks
    const ticksContainer = document.getElementById('progress-ticks');
    ticksContainer.innerHTML = '';
    
    // Create goal - 1 spaces between start and end
    for (let i = 0; i < goal; i++) {
        const spacer = document.createElement('div');
        spacer.style.flex = "1";
        ticksContainer.appendChild(spacer);
        
        if (i < goal - 1) {
            const tick = document.createElement('div');
            tick.className = 'tick';
            ticksContainer.appendChild(tick);
        }
    }
}

function renderConversionSettings() {
    const container = document.getElementById('conversion-list');
    container.innerHTML = '';
    
    for (const [food, value] of Object.entries(settings.foods)) {
        const div = document.createElement('div');
        div.className = 'conversion-item';
        div.innerHTML = `
            <span>${formatFoodName(food)}</span>
            <input type="number" 
                   value="${value}" 
                   min="0.1" 
                   step="0.1"
                   data-food="${food}"
                   class="conversion-input">
            <button onclick="removeFood('${food}')">×</button>
        `;
        container.appendChild(div);
    }
}

function removeFood(food) {
    delete settings.foods[food];
    delete quantities[food];
    renderConversionSettings();
    renderFoodInputs();
    updateDisplay();
}

function addNewFood() {
    const nameInput = document.getElementById('new-food-name');
    const valueInput = document.getElementById('new-food-value');
    
    const name = nameInput.value.trim().toLowerCase().replace(/\s+/g, '');
    const value = parseFloat(valueInput.value);
    
    if (!name || !value || value <= 0) return;
    
    settings.foods[name] = value;
    quantities[name] = 0;
    
    nameInput.value = '';
    valueInput.value = '';
    
    renderConversionSettings();
    renderFoodInputs();
}

function saveAllSettings() {
    const goalInput = document.getElementById('weekly-goal');
    settings.weeklyGoal = parseInt(goalInput.value) || 20;
    
    const conversionInputs = document.querySelectorAll('.conversion-input');
    conversionInputs.forEach(input => {
        const food = input.dataset.food;
        settings.foods[food] = parseFloat(input.value) || 1;
    });
    
    saveSettings();
    saveQuantities();
    renderFoodInputs();
    updateDisplay();
    
    document.getElementById('settings-modal').classList.add('hidden');
}

document.getElementById('settings-btn').addEventListener('click', () => {
    document.getElementById('weekly-goal').value = settings.weeklyGoal;
    renderConversionSettings();
    document.getElementById('settings-modal').classList.remove('hidden');
});

document.getElementById('close-modal').addEventListener('click', () => {
    document.getElementById('settings-modal').classList.add('hidden');
});

document.getElementById('save-settings').addEventListener('click', saveAllSettings);
document.getElementById('add-food-btn').addEventListener('click', addNewFood);

loadSettings();
renderFoodInputs();
updateDisplay();
