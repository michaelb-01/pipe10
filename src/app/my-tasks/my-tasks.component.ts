import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';

import { MeteorObservable } from 'meteor-rxjs';

import { Tasks } from '../../../api/server/collections/tasks';
import { Task } from '../../../api/server/models/task';

import { SortableDirective } from './sortable.directive';

import * as _ from 'lodash';

@Component({
  selector: 'app-my-tasks',
  templateUrl: './my-tasks.component.html',
  styleUrls: ['./my-tasks.component.scss'],
  host: {
    '(document:click)': 'onClick($event)',
  }
})
export class MyTasksComponent implements OnInit {
  username:string = 'Mike Battcock';

  paramsSub: Subscription;
  myTasksSub: Subscription;

  tasks;

  editing = {};

  todoInput:string = '';

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {

    this.myTasksSub = MeteorObservable.subscribe('myTasks', this.username).subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        this.tasks = Tasks.find().map((tasks:any)=>{

          tasks.map((task:any)=>{
            //if (!task.hasOwnProperty('todos')) { 
              //return task;
            //}

            let num = 0;

            task.todos.forEach(todo=>{
              if (todo.done) {
                num++;
              }
            });

            task.todosDone = num;

            return task;
          });

          return tasks;
        });


        this.tasks.subscribe(x=>{
          //console.log(x);
        })

        if (!this.tasks) return;
      });
    });
  }

  toggleTodo(task,todo) {
    //console.log(task);
    //console.log(todo);

    MeteorObservable.call('updateTaskTodo', task, todo, todo.text).subscribe({
      error: (e: Error) => {
        if (e) {
          console.log(e);
        }
      }
    });
  }

  editTodoLabel(todo) {
    if (!todo.editing) {
      todo.editing = true;
    }
    else {
      todo.editing = false;
    }
  }

  createTodo(task) {
    this.todoInput = '';

    let todo = {
      "author":"Mike Battcock",
      "text":"",
      "done":false
    }

    Tasks.update({"_id":task._id},{"$push":{"todos":todo}});
  }

  updateTodo(todo,task) {
    let oldTodoText = todo.text;
    todo.text = this.todoInput;

    MeteorObservable.call('updateTaskTodo', task, todo, oldTodoText).subscribe({
      error: (e: Error) => {
        if (e) {
          console.log(e);
        }
      }
    });
  }

  deleteTodo(todo,task) {
    Tasks.update({"_id":task._id},{"$pull":{"todos":{"text":todo.text}}});
  }

  onClick(event) {
    if (!this.tasks) return;

    for (let i = 0; i < event.target.classList.length; i++) {
      if (event.target.classList[i] == 'todo-label' || event.target.classList[i] == 'todo-label-textarea') {
        return;
      }
    }

    this.tasks.source._data.forEach(task=>{
      task.todos.forEach(todo=>{
        todo.editing = false;
      })
    })
  }

  filterTodos(task) {
    task.filterTodos = !task.filterTodos;
    Tasks.update({"_id":task._id},{"$set":{"filterTodos":task.filterTodos}});
  }


}
