import { Injectable } from '@angular/core';

import { ipcRenderer, Menu } from 'electron';
import * as childProcess from 'child_process';

@Injectable()
export class ElectronService {
  ipcRenderer: typeof ipcRenderer;
  childProcess: typeof childProcess;
  menu: typeof Menu;

  constructor() { }

  isElectron = () => {

    console.log(process);
    console.log(process.type);
//    return window && window.process && window.process.type;
  }

}
