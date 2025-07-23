export function createControlPanel() {
  const panel = document.getElementById('control-panel');
  panel.innerHTML = ''; // Clear if regenerated

  const buttons = [
    { id: 'randomise', label: 'Randomise' },
    { id: 'solve', label: 'Solve it' },
    { id: 'check', label: 'Check' },
    { id: 'speed', label: 'Speed: Fast' }
  ];

  buttons.forEach(btn => {
    const div = document.createElement('div');
    div.className = 'control-button';
    div.id = btn.id;
    div.textContent = btn.label;
    panel.appendChild(div);
  });
}

// You can remove setupButtonEvents entirely OR leave it empty if needed
export function setupButtonEvents() {
  // No default alerts here anymore
}
