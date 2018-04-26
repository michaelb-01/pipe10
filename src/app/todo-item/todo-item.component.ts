import { Component, OnInit, Input, Output, EventEmitter, ElementRef } from '@angular/core';

import { Todo } from '../../../api/server/models/todo';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss'],
  host: {
    '(document:click)': 'onClick($event)',
  },
})
export class TodoItemComponent implements OnInit {
  @Input() todo: Todo;
  @Output() updateTodo: EventEmitter<any> = new EventEmitter();

  constructor(private _eref: ElementRef) {
    
  }

  ngOnInit() {
    this.todo.editing = false;
  }

  onClick(event) {
    //console.log('click todo item');
    //console.log(event.target.classList);
    //if (this._eref.nativeElement.contains(event.target)) {
    if (this._eref.nativeElement.contains(event.target) && event.target.classList.contains("todo-label")) {
      this.todo.editing = true;
    }
    else if (!event.target.classList.contains("todo-label-textarea")) {
      this.todo.editing = false
    }
  }

  toggleDone() {
    //Tasks.update({"_id":this.todo._id},{"done":!this.todo.done});
    //this.todo.done = !this.todo.done;
    let todo = Object.assign({}, this.todo);
    todo.done = !todo.done;
    delete todo.editing;
    this.updateTodo.emit([todo,this.todo.text]);
  }

}
