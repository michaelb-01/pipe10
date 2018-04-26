import 'meteor-client';

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

//var appVersion = require('electron').remote.app.getVersion();

//import * as electron from "electron";

//import { ipcRenderer } from 'electron';

//import { ElectronService } from './app/electron.service';

if (environment.production) {
  enableProdMode();
}

var userAgent = navigator.userAgent.toLowerCase();

if (userAgent.includes('electron')) {
  console.log('IN ELECTRON');
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
