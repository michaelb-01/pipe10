import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { Subscription } from 'rxjs/Subscription';
import { MeteorObservable } from 'meteor-rxjs';

import { Tasks } from '../../../api/server/collections/tasks';
import { Task } from '../../../api/server/models/task';

import { Todo } from '../../../api/server/models/todo';

import * as _ from 'lodash';

@Component({
  selector: 'app-sidebar-left',
  templateUrl: './sidebar-left.component.html',
  styleUrls: ['./sidebar-left.component.scss']
})
export class SidebarLeftComponent implements OnInit {
  myTasksSub: Subscription;
  newTodo: Todo = new Todo;
  entities;

  username: string = 'Mike Battcock';

  constructor() { }

  ngOnInit() {

    this.myTasksSub = MeteorObservable.subscribe('myTasks', this.username).subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        this.entities = Tasks.find()
          .map((tasks: Task[]) => {
            // Group by entity
            const groupedTasks = _.groupBy(tasks, (task) => {
              return task.entity.entityId.valueOf();
            });

            //console.log(groupedTasks);

            // Transform dictionary into an array since Angular's view engine doesn't know how
            // to iterate through it
            return Object.keys(groupedTasks).map((entity) => {
              return {
                entity: entity,
                tasks: groupedTasks[entity]
              };
            });
        });

        if (!this.entities) return;
      });
    });
  }

  createTodo() {
    console.log(this.newTodo);
  }

  taskMouseEnter(event,entity,task,i) {
    console.log(task);
    console.log(i);
    entity.taskNum = i;
  }

}
