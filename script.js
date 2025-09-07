const formulasContainer = document.getElementById('formulas');

  const formulaSlots = document.querySelectorAll('.slot');
  const formulaMessage = document.getElementById('formula-message');
  const checkButton = document.getElementById('check-button');
  let draggedFormula = null;

  const gameData = [
    { id: 1, text: '$$E=mc^2$$' },
    { id: 2, text: '$$a^2+b^2=c^2$$' },
    { id: 3, text: '$$F=ma$$' }
  ];

  function createItems() {
    gameData.forEach(data => {
      const item = document.createElement('div');
      item.className = 'item';
      item.setAttribute('data-id', data.id);
      item.setAttribute('draggable', true);
      item.innerHTML = data.text;
      formulasContainer.appendChild(item);
    });
  }

  function addDragListeners() {
    document.querySelectorAll('.item').forEach(item => {
      item.addEventListener('dragstart', () => { draggedFormula = item; setTimeout(() => item.classList.add('dragging'), 0); });
      item.addEventListener('dragend', () => { if(draggedFormula) {draggedFormula.classList.remove('dragging')}; draggedFormula = null; });
    });
  }

   formulasContainer.addEventListener('dragover', e => e.preventDefault());
  formulasContainer.addEventListener('drop', e => {
    e.preventDefault();
    if (draggedFormula) {
       formulasContainer.appendChild(draggedFormula);

      saveFormulaState();

      updateButtonState();
      clearMessage();
    }
  });

   formulaSlots.forEach(slot => {
    slot.addEventListener('dragover', e => e.preventDefault());
    slot.addEventListener('drop', e => {
      e.preventDefault();
      if (draggedFormula) {
        const itemInSlot = slot.querySelector('.item');
         if (itemInSlot) {
          draggedFormula.parentNode.appendChild(itemInSlot);
        }
        slot.appendChild(draggedFormula);

        saveFormulaState();
        updateButtonState();
      clearMessage();
      }
    });
  });

  function updateButtonState() {
    const allSlotsFilled = [...formulaSlots].every(slot => slot.querySelector('.item'));
    checkButton.style.display = allSlotsFilled ? 'inline-block' : 'none';
  }

  function clearMessage() {
    formulaMessage.textContent = "";
   formulaMessage.className = "";
  }

  function checkFormulaWin() {
    const isWin = [...formulaSlots].every(slot => {
      const itemInSlot = slot.querySelector('.item');
      return itemInSlot && itemInSlot.getAttribute('data-id') === slot.getAttribute('data-id');
    });

    if (isWin) {
      formulaMessage.textContent = "Отлично! Все формулы на своих местах!";
      formulaMessage.classList.add('win-message');
    } else {
      formulaMessage.textContent = "Попробуйте еще раз! Есть ошибки.";
       formulaMessage.classList.add('error-message');
    }
    checkButton.style.display = 'none';
  }

  checkButton.addEventListener('click', checkFormulaWin);

  function saveFormulaState() {
    const state = [];
    formulaSlots.forEach(slot => {
      const itemInSlot = slot.querySelector('.item');
      if (itemInSlot) {
        state.push({
          slotId: slot.getAttribute('data-id'),
          itemId: itemInSlot.getAttribute('data-id')
        });
      }
    });
    localStorage.setItem('formulaState', JSON.stringify(state));
  }

  function loadFormulaState() {
    const state = JSON.parse(localStorage.getItem('formulaState') || '[]');
    state.forEach(itemState => {
      const piece = document.querySelector(`.item[data-id='${itemState.itemId}']`);
      const slot = document.querySelector(`.slot[data-id='${itemState.slotId}']`);
      if (piece && slot) slot.appendChild(piece);
    });
  }

   createItems();
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
  script.async = true;
  script.onload = () => {
    loadFormulaState();
    updateButtonState();
    addDragListeners();
    if (window.MathJax) window.MathJax.typeset();
  };
  document.head.appendChild(script);
