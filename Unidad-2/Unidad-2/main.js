import { ApplicationModel } from './ApplicationModel.js';
import { ApplicationUI } from './ApplicationUI.js';

// Instanciamos el modelo de la aplicación
const model = new ApplicationModel();

// Instanciamos la interfaz de usuario, pasando el modelo como dependencia
const ui = new ApplicationUI(model);

// Inicializamos la interfaz de usuario
ui.mainMenu();