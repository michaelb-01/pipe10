import { Injectable } from '@angular/core';

@Injectable()
export class ReviewService {
  dragging:boolean = false;

  // video variables
  playing:boolean = false;

  frame:number = 1;
  time:number = 1;

  constructor() { }

}
