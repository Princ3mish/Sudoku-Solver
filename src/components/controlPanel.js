export function createControlPanel() {
  // Ensure layout container exists
  let layout = document.getElementById('layout');
  if (!layout) {
    layout = document.createElement('div');
    layout.id = 'layout';
    document.body.appendChild(layout);
  }

  // Create or reuse control panel
  let panel = document.getElementById('control-panel');
  if (!panel) {
    panel = document.createElement('div');
    panel.id = 'control-panel';
    layout.appendChild(panel);
  } else {
    panel.innerHTML = '';
  }

  // Define control buttons
  const buttons = [
    { id: 'randomise', text: 'Randomise' },
    { id: 'solve', text: 'Solve it' },
    { id: 'stuck', text: 'Stuck?' },
    { id: 'speed', text: 'Speed: Fast' }
  ];

  // Add each button inside its wrapper
  buttons.forEach(({ id, text }) => {
    const buttonWrapper = document.createElement('div');
    buttonWrapper.classList.add('control-button');

    const button = document.createElement('button');
    button.id = id;
    button.textContent = text;

    buttonWrapper.appendChild(button);
    panel.appendChild(buttonWrapper);
  });
}
