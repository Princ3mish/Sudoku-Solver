// src/components/controlPanel.js

export function createControlPanel() {
  const panel = document.createElement('div');
  panel.id = 'control-panel';

  const buttons = [
    { id: 'randomise', text: 'Randomise' },
    { id: 'solve', text: 'Solve it' },
    { id: 'stuck', text: 'Stuck?' },
    { id: 'speed', text: 'Speed: Fast' }
  ];

  buttons.forEach(({ id, text }) => {
    const buttonWrapper = document.createElement('div');
    buttonWrapper.classList.add('control-button');

    const button = document.createElement('button');
    button.id = id;
    button.textContent = text;

    buttonWrapper.appendChild(button);
    panel.appendChild(buttonWrapper);
  });

  document.body.appendChild(panel);
}
