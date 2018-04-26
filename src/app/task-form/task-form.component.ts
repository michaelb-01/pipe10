import { Component, OnInit } from '@angular/core';
import { Entity } from '../../../api/server/models/entity';

import { Tasks } from '../../../api/server/collections/tasks';
import { Task } from '../../../api/server/models/task';

import { FormControl } from '@angular/forms';

import { Observable } from 'rxjs';
import { MeteorObservable } from 'meteor-rxjs';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

import { Users } from '../../../api/server/collections/users';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnInit {
  usersSub: Subscription;
  users;

  entity:Entity = new Entity();

  task:Task = new Task();

  formTitle;

  userCtrl = new FormControl();
  taskCtrl = new FormControl();
  dateCtrl = new FormControl();

  entitiesForm;
  filteredUsers: Observable<any[]>;

  selectedUsers: any[] = [];

  editing = false;

  tasks = [
    {value:'track',viewValue:'Track'},
    {value:'model',viewValue:'Model'},
    {value:'texture',viewValue:'Texture'},
    {value:'rig',viewValue:'Rig'},
    {value:'anim',viewValue:'Animation'},
    {value:'fx',viewValue:'FX'},
    {value:'lookDev',viewValue:'Look Development'},
    {value:'light',viewValue:'Light'},
    {value:'roto',viewValue:'Roto'},
    {value:'preComp',viewValue:'Pre Comp'},
    {value:'comp',viewValue:'Comp'}
  ];

  filteredTasks = [];
  selectedTask = this.tasks[0];

  statuses = [
    {value: 'notStarted', viewValue: 'Not Started'},
    {value: 'active', viewValue: 'Active'},
    {value: 'pendingFeedback', viewValue: 'Pending Feedback'},
    {value: 'complete', viewValue: 'Complete'},
  ]

  entityName:string = '';

  currentStatus;

  constructor() { }

  ngOnInit() {
    this.usersSub = MeteorObservable.subscribe('users').subscribe(() => {
      Users.find().subscribe((users)=>{
        this.users = users;
      })
    });

    // remove this from the subscribe function if you don't want pre-filled list 
    // to show up when sidenav opens
    this.filteredUsers = this.userCtrl.valueChanges
        .startWith(null)
        .map(user => user && typeof user === 'object' ? user.profile.name : user)
        .map(name => this.filterUsers(name));
  }

  selectTask(entity,task) {
    this.entity = entity;
    this.task = task;

    console.log(task);

    this.selectedUsers = [];

    this.task.users.forEach(user=>{
      let newUser = {
        profile:{
          name:user
        }
      }
      this.selectedUsers.push(newUser);
    })

    this.formTitle = 'Update Task';

    //this.selectedUsers = this.task.users;
  }

  filterUsers(name:string) {
    if (this.users == null) return [];
    if (name == null) {
      name = '';
    }

    let filteredUsers = [];
    for(var i = 0; i < this.users.length; i++) {
      if (name != '' && this.users[i].profile.name.toLowerCase().indexOf(name.toLowerCase()) !== 0) {
        continue;
      }
      let ok = 1;
      for(let j = 0; j < this.selectedUsers.length; j++) {
        if (this.selectedUsers[j].profile.name == this.users[i].profile.name) {
          ok = 0;
          break;
        }
      }
      if (ok == 1) {
        filteredUsers.push(this.users[i]);
      }
    }
    
    return filteredUsers;
  }

  addUser(user) {
    if (this.selectedUsers.indexOf(user) == -1) {
      this.selectedUsers.push(user);
    }

    this.userCtrl.setValue('');

    console.log(this.selectedUsers);
  }

  removeUser(user) {
    for (var i = 0; i < this.selectedUsers.length; i++) {
      if (user.profile.name == this.selectedUsers[i].profile.name) {
        this.selectedUsers.splice(i,1);
        return;
      }
    }
  }

  addTask(entity) {
    this.formTitle = 'Create Task';
    this.entity = entity;

    // filter tasks based on pre-existing tasks on entity
    this.filteredTasks = this.tasks.filter(task=>{
      return entity.tasks.filter(entityTask=>{
        return entityTask.type.toLowerCase() == task.value.toLowerCase();
      }).length == 0;
    })

    this.selectedUsers = [];
    this.editing = false;
    this.dateCtrl.setValue(null);
    this.currentStatus = 'active';

    this.entityName = entity.name;
  }

  onSubmit(form) {
    if (this.formTitle == 'Update Task') {
      this.updateTask();
    }
    //this.entity.status = 
  }

  updateTask() {
    this.task.users = [];
    this.selectedUsers.forEach(user=>{
      this.task.users.push(user.profile.name);
    })

    Tasks.update( { "_id": this.task._id }, this.task );
  }
}
