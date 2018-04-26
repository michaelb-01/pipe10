import { Component, OnInit, EventEmitter, Input, Output, HostBinding, HostListener, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-gantt-item',
  templateUrl: './gantt-item.component.html',
  styleUrls: ['./gantt-item.component.scss']
})
export class GanttItemComponent implements OnInit {
  @Input('task') task;
  @Input('cellWidth') cellWidth;
  @Input('containerBbox') containerBbox;

  @Output() mouseDown = new EventEmitter();

  @HostBinding('style.left') left;
  @HostBinding('style.width') width;
  @HostBinding('class.dragging') get c1 () {      if (this.dragging || this.resizingStart || this.resizingEnd) {
      return true;
    } 
  }

  // events
  mouseMoveFn;
  mouseUpFn;

  // mouse variables
  dragging:boolean = false;
  resizingStart:boolean = false;
  resizingEnd:boolean = false;
  offsetX:number;

  constructor(private renderer: Renderer2) {
  this.mouseUpFn = this.renderer.listen('document', 'mouseup', (e) => {
      this.updateTask(e);
      this.removeListener();
    })
  }

  ngOnInit() {
    this.updatePosition();
  }

  taskMouseDown(e) {
    this.dragging = true;
    this.offsetX = e.pageX;
    this.addListener();
  }

  taskMouseMove(e) {
      let left = (this.task.startIndex * this.cellWidth) + (e.pageX-this.offsetX);

      this.left = left + 'px';

      let newIndex = Math.max(0,Math.floor((left / (this.width)) + 0.5));
  }

  handleEndDown(e) {
    this.resizingEnd = true;
    this.offsetX = e.pageX;
    this.addListener();
  }

  handleStartDown(e) {
    this.resizingStart = true;
    this.offsetX = e.pageX;
    this.addListener();
  }

  resizeEnd(e) {
    let width = (this.task.length * this.cellWidth) + (e.pageX-this.offsetX);

    this.width = width + 'px';
  }

  resizeStart(e) {
    let offset = e.pageX-this.offsetX;

    let left = (this.task.startIndex * this.cellWidth) + offset;

    let width = (this.task.length * this.cellWidth) - offset;

    this.left = left + 'px';
    this.width = width + 'px';
  }

  updatePosition() {
    this.left = this.task.startIndex * this.cellWidth + 'px';
    this.width = this.task.length * this.cellWidth + 'px';
  }

  addListener() {
    this.mouseMoveFn = this.renderer.listen('document', 'mousemove', (e) => {
      if (this.dragging) {
        this.taskMouseMove(e);
      }
      else if (this.resizingEnd) {
        this.resizeEnd(e);
      }
      else if (this.resizingStart) {
        this.resizeStart(e);
      }
    })
  }

  removeListener() {
    if (this.mouseMoveFn) {
      this.mouseMoveFn();
    }
    this.dragging = false;
    this.resizingStart = false;
    this.resizingEnd = false;
  }

  updateTask(e) {
    let offset = this.offsetX-e.pageX;

    let indexOffset = Math.floor((offset / (this.cellWidth)) + 0.5);

    if (this.dragging) {
      this.task.startIndex -= indexOffset;
    }
    else if (this.resizingStart) {
      this.task.startIndex -= indexOffset;
      this.task.length += indexOffset;
    }
    else if (this.resizingEnd) {
      this.task.length -= indexOffset;
    }

    this.updatePosition();
  }
}