import { Component, OnInit, Input } from '@angular/core';

import { MeteorObservable } from 'meteor-rxjs';

import { Todo } from '../../../api/server/models/todo';

import { Entities } from '../../../api/server/collections/entities';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {
  @Input() entity: any;

  editing:boolean = false;

  newTodo: Todo = new Todo;

  constructor() { }

  ngOnInit() {
  }

  createTodo() {
    console.log(this.newTodo);

    Entities.update( 
      { "_id": this.entity._id},   
      { "$push": {"todos": this.newTodo } }
    );
  }

  updateTodo(todo) {
    todo.done = !todo.done;

    MeteorObservable.call('updateTodo', this.entity._id, todo).subscribe({
      error: (e: Error) => {
        if (e) {
          console.log(e);
        }
      }
    });
  }

}
