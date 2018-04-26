import { Component, OnInit, ViewChild } from '@angular/core';

import { Observable, Subscriber } from 'rxjs';
import { MeteorObservable } from 'meteor-rxjs';

import { Jobs } from '../../../api/server/collections/jobs';

import { SidenavService } from '../sidenav.service';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss']
})
export class JobsComponent implements OnInit {
  @ViewChild('thumbnail') thumbnail:any;
  @ViewChild('sidenavRight') public sidenavRight;

  jobs;
  seekPos = -1;

  filter: string;

  constructor(private sidenavService: SidenavService) {
    sidenavService.sidenavTriggered.subscribe(
      val => {
        this.openSidenav();
      });
  }

  ngOnInit() {
    MeteorObservable.subscribe('jobs').subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        this.jobs = Jobs.find();
      });
    });
  }

  openSidenav() {
    this.sidenavRight.open();
  }
}
