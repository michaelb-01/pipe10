import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { Entities } from '../../../api/server/collections/entities';
import { Entity } from '../../../api/server/models/entity';

import { Tasks } from '../../../api/server/collections/tasks';
import { Task } from '../../../api/server/models/task';

import { Observable } from 'rxjs';
import { Subscription } from 'rxjs/Subscription';

import { MeteorObservable } from 'meteor-rxjs';

import { SidenavService } from '../sidenav.service';

import * as _ from 'lodash';

@Component({
  selector: 'app-entities',
  templateUrl: './entities.component.html',
  styleUrls: ['./entities.component.scss']
})
export class EntitiesComponent implements OnInit {
  @ViewChild('sidenavRight') sidenavRight;
  @ViewChild('taskForm') taskForm;

  @Input() job;

  @Output() onSelectEntity = new EventEmitter();

  paramsSub: Subscription;
  entitiesSub: Subscription;

  usersSub: Subscription;

  entities;
  entities2;  
  tasks;

  assets;
  shots;

  open:boolean = true;

  showAssign:boolean = false;
  listView:boolean = false;

  constructor(private route: ActivatedRoute,
              private sidenavService: SidenavService) { }

  sortFn(a, b) {
    if (a.name < b.name)
      return -1;
    if (a.name > b.name)
      return 1;
    return 0;
  };

  ngOnInit() {
    this.paramsSub = this.route.params
      .map(params => params['jobId'])
      .subscribe(jobId => {
        if (this.entitiesSub) {
          this.entitiesSub.unsubscribe();
        }

        this.entitiesSub = MeteorObservable.subscribe('jobEntities', jobId).subscribe(() => {
          MeteorObservable.autorun().subscribe(() => {
            this.entities = Entities.find({"job.jobId":jobId});

            this.tasks = this.findGroupedTasks();

            this.assets = Observable.combineLatest(this.entities,this.tasks,(entities:any,tasks:any) => {
              // filter by shots, then add tasks for that entity
              return entities.filter(entity => entity.type == 'asset')
                             .map(entity => {
                                let filteredTasks = tasks.filter(task => task.entity == entity._id);

                                if (filteredTasks.length > 0) {
                                  entity.tasks = filteredTasks[0].tasks;
                                }
                                return entity;
                              })
                             .sort(this.sortFn);
            });

            this.shots = Observable.combineLatest(this.entities,this.tasks,(entities:any,tasks:any) => {
              // filter by shots, then add tasks for that entity
              return entities.filter(entity => entity.type == 'shot')
                             .map(entity => {
                                let filteredTasks = tasks.filter(task => task.entity == entity._id);

                                if (filteredTasks.length > 0) {
                                  entity.tasks = filteredTasks[0].tasks;
                                }
                                return entity;
                              })
                             .sort(this.sortFn);
            });

            if (!this.entities) return;
          });
        });
      });
  }

  findGroupedTasks() {
    return Tasks.find()
      .map((tasks: Task[]) => {
        // Group by entity
        const groupedTasks = _.groupBy(tasks, (task) => {
          return task.entity.entityId.valueOf();
        });

        // Transform dictionary into an array since Angular's view engine doesn't know how
        // to iterate through it
        return Object.keys(groupedTasks).map((entity) => {
          return {
            entity: entity,
            tasks: groupedTasks[entity]
          };
        });
    });
  }

  openSidenav() {
    this.sidenavService.toggleSidenavRight();
  }

  selectTask(event, entity,task) {
    this.taskForm.selectTask(entity,task);
    this.sidenavRight.open();
    event.stopPropagation();
  }

  addTask(entity) {
    this.taskForm.addTask(entity);
    this.sidenavRight.open();
  }

  selectEntity(entity) {
    //this.sidenavRight.open();
    this.onSelectEntity.emit(entity);
  }

}
