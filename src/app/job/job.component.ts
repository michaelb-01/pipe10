import { Component, OnInit, ViewChild } from '@angular/core';
import { Jobs } from '../../../api/server/collections/jobs';
import { Job } from '../../../api/server/models/job';

import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/map';

import { ActivatedRoute } from '@angular/router';

import { MeteorObservable } from 'meteor-rxjs';

import { SidenavService } from '../sidenav.service';

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.scss']
})
export class JobComponent implements OnInit {
  @ViewChild('sidenavRight') public sidenavRight;
  @ViewChild('entityForm') public entityForm;

  paramsSub: Subscription;
  jobSub: Subscription;
  job;

  constructor(private route: ActivatedRoute,
              private sidenavService: SidenavService) {
    sidenavService.sidenavTriggered.subscribe(
      val => {
        this.onCreateEntity();
        console.log('sidenav triggered from shared service');
      });
  }

  ngOnInit() {
    this.paramsSub = this.route.params
      .map(params => params['jobId'])
      .subscribe(jobId => {
        MeteorObservable.subscribe('jobs').subscribe(() => {
          MeteorObservable.autorun().subscribe(() => {
            this.job = Jobs.findOne(new Mongo.ObjectID(jobId));           
          });
        });

        // this.jobSub = MeteorObservable.subscribe('jobs', jobId).subscribe(() => {
        //   MeteorObservable.autorun().subscribe(() => {
        //     this.job = Jobs.findOne({"_id":jobId});
        //   });
        // });

        // this.job.subscribe(x=>{
        //   console.log(x);
        // })

    });
  }

  onCreateEntity() {
    this.entityForm.resetEntity();
    this.entityForm.updateJob(this.job);
    this.sidenavRight.open();
  }

  onSelectEntity(entity) {
    this.entityForm.updateEntity(entity);
    this.sidenavRight.open();
  }
}
