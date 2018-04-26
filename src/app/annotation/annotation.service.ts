import { Injectable } from '@angular/core';

@Injectable()
export class AnnotationService {
  dragging:boolean;

  frame:number = 1;
  time:number = 1;

  constructor() {
    this.dragging = false;
  }

  // setDragging(val:boolean) {
  //   this.dragging = val;
  //   console.log('set dragging to: ' + val);
  // }

  // getDragging(val:boolean) {
  //   return this.dragging;
  // }

}
