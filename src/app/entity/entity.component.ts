import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/map';
import { MeteorObservable } from 'meteor-rxjs';

import { Entity } from "../../../api/server/models/entity";
import { Entities } from "../../../api/server/collections/entities";

import { SidenavService } from '../sidenav.service';

@Component({
  selector: 'app-entity',
  templateUrl: './entity.component.html',
  styleUrls: ['./entity.component.scss']
})
export class EntityComponent implements OnInit {
  @ViewChild('sidenavRight') public sidenavRight;
  @ViewChild('versionForm') public versionForm;

  paramsSub: Subscription;

  entitySub: Subscription;
  entityId: string;
  entity;

  taskType: string;

  constructor(private route: ActivatedRoute,
              private sidenavService: SidenavService) {
    sidenavService.sidenavTriggered.subscribe(
      val => {
        console.log('Entity.component.ts - sidenav triggered from shared service');
        this.openSidenav();
      }); 
  }

  ngOnInit() {
    this.paramsSub = this.route.params
      .subscribe(params => {
        this.entityId = params['entityId'];
        this.taskType = params['taskType'];

        console.log(this.entityId);
        console.log(this.taskType);

        if (this.entitySub) {
          this.entitySub.unsubscribe();
        }

        this.entitySub = MeteorObservable.subscribe('entity',this.entityId).subscribe(() => {
          MeteorObservable.autorun().subscribe(() => {
            this.entity = Entities.findOne(new Mongo.ObjectID(this.entityId));

            console.log(this.entity);
          });
        });

      });

      if (!this.entityId) {
        console.log('entity id not found');
      } 
  }

  openSidenav() {
    this.versionForm.updateVersion();
    this.sidenavRight.open();
  }

  onSelectVersion($event) {
    console.log($event);
  }
}
