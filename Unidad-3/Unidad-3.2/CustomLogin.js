export class CustomLogin extends HTMLElement {
  constructor() {
    super();
    // Contenedor principal
    this.classList.add('w3-container', 'w3-half', 'w3-margin-top');
    // Formulario
    this.form = document.createElement('form');
    this.form.classList.add('w3-container', 'w3-card-4');

    // Header
    this.header = document.createElement('header');
    this.header.classList.add('w3-container', 'w3-teal');
    const h1 = document.createElement('h1');
    h1.textContent = 'Login Example';
    this.header.appendChild(h1);

    // Campos del formulario
    const fields = [
      { type: 'text', label: 'Name', required: true },
      { type: 'password', label: 'Password', required: true },
    ];
    this.inputs = [];

    fields.forEach(f => {
      const p = document.createElement('p');
      const input = document.createElement('input');
      input.type = f.type;
      input.required = !!f.required;
      input.classList.add('w3-input');
      input.style.width = '90%';
      const label = document.createElement('label');
      label.textContent = f.label;
      p.appendChild(input);
      p.appendChild(label);
      this.form.appendChild(p);
      this.inputs.push(input);
    });

    // Radios
    const radios = [
      { value: 'male', label: 'Male', checked: true },
      { value: 'female', label: 'Female', checked: false },
      { value: '', label: `Don't know (Disabled)`, checked: false, disabled: true },
    ];
    radios.forEach(r => {
      const p = document.createElement('p');
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = 'gender';
      input.value = r.value;
      if (r.checked) input.checked = true;
      if (r.disabled) input.disabled = true;
      input.classList.add('w3-radio');
      const label = document.createElement('label');
      label.textContent = r.label;
      p.appendChild(input);
      p.appendChild(label);
      this.form.appendChild(p);
    });

    // Checkbox
    const pCheck = document.createElement('p');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = 'stay';
    checkbox.checked = true;
    checkbox.classList.add('w3-check');
    const labelCheck = document.createElement('label');
    labelCheck.textContent = 'Stay logged in';
    pCheck.appendChild(checkbox);
    pCheck.appendChild(labelCheck);
    this.form.appendChild(pCheck);

    // Botón
    const pBtn = document.createElement('p');
    const btn = document.createElement('button');
    btn.type = 'submit';
    btn.textContent = 'Log in';
    btn.classList.add('w3-button', 'w3-section', 'w3-teal', 'w3-ripple');
    pBtn.appendChild(btn);
    this.form.appendChild(pBtn);

    // Montaje
    this.appendChild(this.header);
    this.appendChild(this.form);
  }

  connectedCallback() {
    this.form.addEventListener('submit', this.onSubmit);
  }

  disconnectedCallback() {
    this.form.removeEventListener('submit', this.onSubmit);
  }

  // Handler por defecto (puede extenderse)
  onSubmit = event => {
    event.preventDefault();
    const data = {
      name: this.inputs[0].value,
      password: this.inputs[1].value,
      gender: this.form.gender.value,
      stay: this.form.querySelector('#stay').checked,
    };
    console.log('Login data:', data);
    alert(`Datos enviados:\n${JSON.stringify(data, null, 2)}`);
  };
}

customElements.define('x-login', CustomLogin);