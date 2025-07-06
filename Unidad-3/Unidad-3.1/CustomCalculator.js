export class CustomCalculator extends HTMLElement {
  constructor() {
    super();
    this.classList.add('calc-container');

    this.display = document.createElement('input');
    this.display.setAttribute('readonly', '');
    this.display.classList.add('calc-display');

    this.buttons = {};
    const vals = [
      '7','8','9','/',
      '4','5','6','*',
      '1','2','3','-',
      '0','.','=','+',
      'C'
    ];
    vals.forEach(val => {
      const btn = document.createElement('button');
      btn.innerText = val;
      btn.classList.add('calc-btn');
      if (val === 'C') btn.classList.add('clear');
      this.buttons[val] = btn;
    });
  }

  onButtonClick(event) {
    const val = event.target.innerText;

    if (val === 'C') {
      this.display.value = '';
    } else if (val === '=') {
      try {
        this.display.value = eval(this.display.value);
      } catch {
        this.display.value = 'Error';
      }
    } else {
      this.display.value += val;
    }
  }

  connectedCallback() {
    this.appendChild(this.display);

    // Contenedor de botones
    const grid = document.createElement('div');
    grid.classList.add('calc-grid');
    this.appendChild(grid);

    // Cuando "C" se posiciona en la última fila centrado
    const order = [
      '7','8','9','/',
      '4','5','6','*',
      '1','2','3','-',
      '0','.','=','+',
      'C'
    ];
    order.forEach(val => {
      const btn = this.buttons[val];
      grid.appendChild(btn);
      btn.onclick = this.onButtonClick.bind(this);
    });
  }

  disconnectedCallback() {}
  adoptedCallback() {}
  attributeChangedCallback() {}
  static get observedAttributes() { return []; }
}

customElements.define('x-calculator', CustomCalculator);