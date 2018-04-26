import { Component, OnInit } from '@angular/core';
import { MeteorObservable } from 'meteor-rxjs';
import { FormControl } from '@angular/forms';

import { Job } from '../../../api/server/models/job';

import { Client } from '../../../api/server/models/client';
import { Clients } from '../../../api/server/collections/clients';

import { cameras } from '../../../api/cameras';
import { site, jobStructure, shotStructure } from "../../../api/settings";

//import drivelist = require('drivelist');


@Component({
  selector: 'app-job-form',
  templateUrl: './job-form.component.html',
  styleUrls: ['./job-form.component.scss']
})
export class JobFormComponent implements OnInit {
  job = new Job();

  //fps: any = '25';
  fps = new FormControl(25);
  clientCtrl:FormControl = new FormControl();

  clients;
  filteredClients;

  numShots: number = 20;

  formats = [
    {width: '1280', height: '720', name: 'HD_720'},
    {width: '1920', height: '1080', name: 'HD_1080'}
  ];

  // initialise cameras
  cameras = cameras;
  cameraBrand:string;

  cameras2 = [
    {brand: 'steak-0', names: ['Steak','asdf']},
    {brand: 'pizza-1', names: ['Pizza','wrgerqb']},
    {brand: 'tacos-2', names: ['Tacos','asdgwe']}
  ];


  frameRates = [
    24,
    25,
    30
  ];

  constructor() { }

  ngOnInit() {
    MeteorObservable.subscribe('clients').subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        Clients.find()
          .subscribe((data) => {
              this.clients = data;

              // this.filteredClients = this.clientCtrl.valueChanges
              //   .startWith(null)
              //   .map(i => i && i === 'object' ? i.name : i)
              //   .map(name => name ? this.filterClient(name) : this.clients.slice());

            }
        );
      });
    });
  }

  filterClient(name) {
    return this.clients.filter(item => new RegExp(`^${name}`, 'gi').test(item.name)); 
  }

  filterClients(val: string) {
    console.log('filter clients');
    console.log(val);
    if (val) {
      this.filteredClients = this.clients
        .filter(client => client.name.toLowerCase().startsWith(val.toLowerCase()));
    }
    else {
      console.log('set filtered to clients');

      this.filteredClients = this.clients;
    }
  }

  onSubmit(name) {
    // create path on disk
    this.job.path = site.root +
                   site.projects + 
                   this.job.client + '/' +
                   this.job.client + '_' + this.job.name + '/';

    MeteorObservable.call('createJob', this.job, this.numShots).subscribe({
      error: (e: Error) => {
        if (e) {
          console.log(e);
        }
      }
    });
  }
  

  onChange(e) {
    console.log(e);
  }
}
