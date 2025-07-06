import { plans } from '../data/plans.js';

class PricingPlans extends HTMLElement {
  constructor() {
    super();
    this.container = document.createElement('div');
    this.container.classList.add('w3-row-padding');
  }

  connectedCallback() {
    const title = document.createElement('div');
    title.classList.add('w3-container');
    
    const heading = document.createElement('h2');
    heading.textContent = 'Responsive Pricing Tables';
    title.appendChild(heading);

    this.appendChild(title);
    this.renderPlans();
    this.appendChild(this.container);
  }

  disconnectedCallback() {
    console.log('PricingPlans disconnected');
  }

  renderPlans() {
    plans.forEach(plan => {
      const column = document.createElement('div');
      column.classList.add('w3-third', 'w3-margin-bottom');

      const ul = document.createElement('ul');
      ul.classList.add('w3-ul', 'w3-border', 'w3-center', 'w3-hover-shadow');

      const header = document.createElement('li');
      header.classList.add(plan.highlightColor, 'w3-xlarge', 'w3-padding-32');
      header.textContent = plan.name;
      ul.appendChild(header);

      const specs = [
        `<b>${plan.storage}</b> Storage`,
        `<b>${plan.emails}</b> Emails`,
        `<b>${plan.domains}</b> Domains`,
        `<b>${plan.support}</b> Support`
      ];

      specs.forEach(text => {
        const li = document.createElement('li');
        li.classList.add('w3-padding-16');
        li.appendChild(this.createHTMLWithBold(text));
        ul.appendChild(li);
      });

      const priceLi = document.createElement('li');
      priceLi.classList.add('w3-padding-16');

      const price = document.createElement('h2');
      price.classList.add('w3-wide');
      price.textContent = `$ ${plan.price}`;
      priceLi.appendChild(price);

      const perMonth = document.createElement('span');
      perMonth.classList.add('w3-opacity');
      perMonth.textContent = 'per month';
      priceLi.appendChild(perMonth);

      ul.appendChild(priceLi);

      const buttonLi = document.createElement('li');
      buttonLi.classList.add('w3-light-grey', 'w3-padding-24');

      const button = document.createElement('button');
      button.classList.add('w3-button', 'w3-green', 'w3-padding-large');
      button.textContent = 'Sign Up';

      buttonLi.appendChild(button);
      ul.appendChild(buttonLi);

      column.appendChild(ul);
      this.container.appendChild(column);
    });
  }

  createHTMLWithBold(text) {
    const temp = document.createElement('span');
    const match = text.match(/<b>(.*?)<\/b>(.*)/);
    if (match) {
      const bold = document.createElement('b');
      bold.textContent = match[1];
      temp.appendChild(bold);
      temp.append(match[2]);
    } else {
      temp.textContent = text;
    }
    return temp;
  }
}

customElements.define('pricing-plans', PricingPlans);