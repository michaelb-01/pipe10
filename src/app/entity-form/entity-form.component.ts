import { Component, OnInit } from '@angular/core';

import { MeteorObservable } from 'meteor-rxjs';

import { Entity } from "../../../api/server/models/entity";
import { Entities } from "../../../api/server/collections/entities";

import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-entity-form',
  templateUrl: './entity-form.component.html',
  styleUrls: ['./entity-form.component.scss']
})
export class EntityFormComponent implements OnInit {
  entity = new Entity();
  job;

  method = 'Create';

  statuses = [
    {value: 'notStarted', viewValue: 'Not Started'},
    {value: 'active', viewValue: 'Active'},
    {value: 'pendingFeedback', viewValue: 'Pending Feedback'},
    {value: 'complete', viewValue: 'Complete'},
  ]

  // _id?: Mongo.ObjectID;
  // job: {
  //   jobId: string,
  //   jobName: string
  // };
  // name: string;
  // type: string;
  // tasks?: any[];
  // status: string;
  // thumbUrl?: string;
  // description?: string;
  // todos?: any[];  
  // path?: string;
  // public: boolean;

  constructor(public snackBar: MatSnackBar) { }

  ngOnInit() {
    console.log(this.entity);
  }

  updateEntity(entity) {
    console.log(entity);
    this.entity = entity;
    this.method = 'Edit';
  }

  resetEntity() {
    this.entity = new Entity();
    this.method = 'Create';
  }

  updateJob(job) {
    console.log('update job');
    console.log(job);
    this.job = job;
  }

  onSubmit() {
    // if (this.entity.type == 'shot') {
    //   this.entity.name = 'sh' + this.pad(this.entity.name,3) + '0';
    // }

    if (this.job) {
      this.entity.job.jobId = this.job._id._str; 
      this.entity.job.jobName = this.job.name;
      this.entity.path = this.job.path + '3d/' + this.entity.type + 's/' + this.entity.name + '/';
    }

    console.log(this.entity);

    MeteorObservable.call('updateEntity', this.entity).subscribe({
      error: (e: Error) => {
        if (e) {
          console.log(e);
        }
      }
    });

    this.snackBar.open("New " + this.entity.type + " create", this.entity.name, {
      duration: 2000
    });
  }

  deleteEntity() {
    MeteorObservable.call('deleteEntity', this.entity).subscribe({
      error: (e: Error) => {
        if (e) {
          console.log(e);
        }
      }
    });
  }

  confirmDeleteEntity(message: string, action: string) {
    let snackBarRef = this.snackBar.open("Are you sure you want to delete " + this.entity.name + "?", "Confirm", {

    });

    snackBarRef.afterDismissed().subscribe(null, null, () => {
      this.deleteEntity();
    })
  }

  pad(num, size) {
      var s = "000000000" + num;
      return s.substr(s.length-size);
  }
}
