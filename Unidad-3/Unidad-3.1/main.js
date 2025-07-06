import { CustomCalculator } from './CustomCalculator.js';

function main() {
  document.body.appendChild(new CustomCalculator());
}

window.addEventListener('DOMContentLoaded', main);