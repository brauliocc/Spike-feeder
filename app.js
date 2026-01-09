const dragonArt = {
    happy: `
           __
          / _)
   _.----/ /
  /         \\
 /    Y    \\ \\
|  (\\ |  /) |/
|   \\||  ||
 \\   |L  J|  
  \\  ||||//
   \\ ||||/
    \\____)
    ^    ^
   HAPPY!
`,
    neutral: `
           __
          / _)
   _.----/ /
  /         \\
 /    -    \\ \\
|  (\\ |  /) |/
|   \\||  ||
 \\   |L  J|  
  \\  ||||//
   \\ ||||/
    \\____)
`,
    sad: `
           __
          / _)
   _.----/ /
  /         \\
 /    v    \\ \\
|  (\\ |  /) |/
|   \\||  ||
 \\   |L  J|  
  \\  ||||//
   \\ ||||/
    \\____)
   hungry...
`,
    overfed: `
           __
          / _)
   _.----/ /
  /         \\
 /    O    \\ \\
|  (\\ |  /) |/
|   \\||  ||
 \\   |L  J|  
  \\  ||||//
   \\ ||||/
    \\____)
   too full!
`
};

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
    
    for (const [food, value] of Object.entries(settings.foods)) {
        const qty = quantities[food] || 0;
        const div = document.createElement('div');
        div.className = 'food-item';
        div.innerHTML = `
            <label>${formatFoodName(food)}</label>
            <span class="conversion-info">(${value} cricket eq. each)</span>
            <input type="number" 
                   id="qty-${food}" 
                   value="${qty}" 
                   min="0" 
                   data-food="${food}"
                   onchange="updateQuantity('${food}', this.value)">
        `;
        container.appendChild(div);
    }
}

function updateQuantity(food, value) {
    quantities[food] = parseInt(value) || 0;
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
    const percentage = Math.min((total / goal) * 100, 120);
    
    document.getElementById('total-value').textContent = total;
    document.getElementById('progress-text').textContent = `${total} / ${goal} cricket equivalents`;
    
    const progressFill = document.getElementById('progress-fill');
    progressFill.style.width = `${Math.min(percentage, 100)}%`;
    
    progressFill.classList.remove('under', 'perfect', 'over');
    
    const dragonEl = document.getElementById('dragon-art');
    const statusEl = document.getElementById('dragon-status');
    
    dragonEl.classList.remove('sad', 'neutral', 'happy', 'overfed');
    
    if (total === 0) {
        dragonEl.textContent = dragonArt.sad;
        dragonEl.classList.add('sad');
        statusEl.textContent = "Feed me some bugs!";
        progressFill.classList.add('under');
    } else if (total < goal * 0.8) {
        dragonEl.textContent = dragonArt.sad;
        dragonEl.classList.add('sad');
        statusEl.textContent = "I'm still hungry...";
        progressFill.classList.add('under');
    } else if (total >= goal * 0.8 && total <= goal * 1.1) {
        dragonEl.textContent = dragonArt.happy;
        dragonEl.classList.add('happy');
        statusEl.textContent = "Perfect! I'm satisfied!";
        progressFill.classList.add('perfect');
    } else if (total > goal * 1.1 && total <= goal * 1.3) {
        dragonEl.textContent = dragonArt.neutral;
        dragonEl.classList.add('neutral');
        statusEl.textContent = "Getting a bit full...";
        progressFill.classList.add('over');
    } else {
        dragonEl.textContent = dragonArt.overfed;
        dragonEl.classList.add('overfed');
        statusEl.textContent = "Too much food!";
        progressFill.classList.add('over');
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
            <button onclick="removeFood('${food}')" title="Remove">X</button>
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
    
    if (!name || !value || value <= 0) {
        alert('Please enter a valid food name and value');
        return;
    }
    
    if (settings.foods[name]) {
        alert('This food already exists!');
        return;
    }
    
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

function openSettings() {
    document.getElementById('weekly-goal').value = settings.weeklyGoal;
    renderConversionSettings();
    document.getElementById('settings-modal').classList.remove('hidden');
}

function closeSettings() {
    document.getElementById('settings-modal').classList.add('hidden');
}

document.getElementById('settings-btn').addEventListener('click', openSettings);
document.getElementById('close-modal').addEventListener('click', closeSettings);
document.getElementById('save-settings').addEventListener('click', saveAllSettings);
document.getElementById('add-food-btn').addEventListener('click', addNewFood);

document.getElementById('settings-modal').addEventListener('click', (e) => {
    if (e.target.id === 'settings-modal') {
        closeSettings();
    }
});

loadSettings();
renderFoodInputs();
updateDisplay();
