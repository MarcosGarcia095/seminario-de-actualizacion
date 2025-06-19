import {ApplicationModel} from './ApplicationModel.js';
import { ApplicationUI } from './ApplicationUI.js';

export class Application
{
    constructor()
    {
        this.model = new ApplicationModel();
        this.ui = new ApplicationUI (this.model);
    }

    run()
    {
        this.ui.mainMenu();
    }
}