import { Component, OnInit, Input, ViewChild } from '@angular/core';

import { Version } from "../../../api/server/models/version";
import { Versions } from '../../../api/server/collections/versions';

import { Annotation } from '../../../api/server/models/annotation';

import { ReviewService } from '../review.service';

import { MeteorObservable } from 'meteor-rxjs';

@Component({
  selector: 'app-annotation',
  templateUrl: './annotation.component.html',
  styleUrls: ['./annotation.component.scss']
})
export class AnnotationComponent implements OnInit {
  @Input() version;

  @ViewChild('annotationContainer') annotationContainer; 

  annotations = [];
  selectedAnnotation:any = new Annotation();

  dragging:boolean = false;
  containerDragging:boolean = false;

  width:number = 1;
  height:number = 1;
  offsetLeft:number = 0;
  offsetTop:number = 0;

  pos1X: number = 0;
  pos1Y: number = 0;
  oldOffsetX:number = 0;
  oldOffsetY:number = 0;

  constructor(public _reviewService: ReviewService) { }

  ngOnInit() {
  }

  // CONTAINER MOUSE EVENTS
  containerMouseDown(event) {
    console.log('mouse down annotation container');

    if (event.shiftKey == false) return;

    let x = event.offsetX;
    let y = event.offsetY;

    let width = event.target.clientWidth;
    let height = event.target.clientHeight;

    let xPerc = (x / width) * 100;
    let yPerc = (y / height) * 100;

    let annotation = new Annotation();

    annotation.x = xPerc;
    annotation.y = yPerc;
    annotation.text = ' new annotation! ';
    annotation.author = 'Mike Battcock';

    this.annotations.push(annotation);

    this.oldOffsetX = annotation.offsetX;
    this.oldOffsetY = annotation.offsetY;

    this.selectedAnnotation.offsetX = annotation.offsetX;
    this.selectedAnnotation.offsetY = annotation.offsetY;

    this.selectedAnnotation = annotation;

    this.calcLine();

    //Versions.update({"_id":this.version._id},{"$push":{"comments":annotation}});
  }

  containerMouseUp(e) {
    console.log('mouse up annotation container');
    this.dragging = false;
    this.containerDragging = false;
  }

  containerMouseMove(event) {
    if (this.dragging) {
      // mouse position
      let x = event.clientX - this.offsetLeft;
      let y = event.clientY - this.offsetTop;

      this.dragAnnotation(x,y);
    }
    else if (this.containerDragging) {
      this.dragAnnotationText(event.pageX - this.offsetLeft, event.pageY - this.offsetTop);
    }
    else {
      return false;
    }

    // calculate angle for connecting line
    this.calcLine();

    return false;
  }

  containerMouseLeave(e) {
    console.log('mouse leave annotation container');
    this.dragging = false;
  }

  calcLine() {
    let x = this.selectedAnnotation.offsetX;
    let y = this.selectedAnnotation.offsetY;

    this.selectedAnnotation.lineRot = (Math.atan2(y, x) * 180 / Math.PI);
    this.selectedAnnotation.lineLen = Math.sqrt( x*x + y*y );
  }

  // ANNOTATION MOUSE EVENTS
  annotationMouseDown(annotation) {
    console.log('annotation mouse down');

    this.dragging = true;
    this.selectedAnnotation = annotation;

    this.updateContainerDimensions();
  }

  annotationMouseUp(annotation) {
    this.dragging = false;
    this.updateAnnotation();
  }

  // ANNOTATION INNER MOUSE EVENTS
  textContainerMouseDown(event,annotation) {
    event.stopPropagation();

    this.selectedAnnotation = annotation;

    console.log('textContainerMouseDown');
    console.log(event);
    // if clicked element is
    // if (event.target.placeholder == "Comment") {
    //   console.log('comment clicked');
    //   event.preventDefault();
    //   event.stopPropagation();
    //   return false;
    // }

    this.updateContainerDimensions();

    this.pos1X = event.pageX - this.offsetLeft;
    this.pos1Y = event.pageY - this.offsetTop;

    console.log('pos1X: ' + this.pos1X);

    this.containerDragging = true;

    this.oldOffsetX = this.selectedAnnotation.offsetX;
    this.oldOffsetY = this.selectedAnnotation.offsetY;
  }

  // DRAGGING
  dragAnnotation(x,y) {
    console.log('drag annotation');
    //let xPerc = this.clamp((x / this.width),0,1) * 100;
    //let yPerc = this.clamp((y / this.height),0,1) * 100;

    let xPerc = x / this.width * 100;
    let yPerc = y / this.height * 100;

    this.selectedAnnotation.x = xPerc;
    this.selectedAnnotation.y = yPerc;

    let col = [0,0];

    //col = this.calcCollision(x,y);

    // this.selectedAnnotation.offsetX = this.oldOffsetX + col[0];
    // this.selectedAnnotation.offsetY = this.oldOffsetY + col[1];

    // if mouse is going over annotation bounce it over
    // if (this.selectedAnnotation.colOffsetX < 0 && this.selectedAnnotation.colOffsetY < 0) {
    //   console.log('bounce over');
    //   this.selectedAnnotation.colOffsetX -= (this.width - (event.clientX - this.offsetLeft)) + 5;
    // }
  }

  dragAnnotationText(mouseX,mouseY) {
    console.log('drag annotation text');

    let x = this.oldOffsetX + (mouseX-this.pos1X);
    let y = this.oldOffsetY + (mouseY-this.pos1Y);

    // let col = this.calcCollision(mouseX,mouseY);

    // x += col[0];
    // y += col[1];

    console.log(x);
    console.log(this.selectedAnnotation);
    console.log(this.annotations);

    this.selectedAnnotation.offsetX = x;
    this.selectedAnnotation.offsetY = y;
  }

  // DIMENSION CALCULATIONS
  updateContainerDimensions() {
    this.width = this.annotationContainer.nativeElement.offsetWidth;
    this.height = this.annotationContainer.nativeElement.offsetHeight;

    let bound = this.annotationContainer.nativeElement.getBoundingClientRect();

    this.offsetLeft = bound.left;
    this.offsetTop = bound.top;
  }

  // ANNOTATION TEXT INPUT
  annotationTextChange() {
    console.log('annotation text change');
  }

  // CRUD 
  createAnnotation(annotation) {
    annotation.frame = this._reviewService.frame;
    Versions.update({"_id":this.version._id},{"$push":{"comments":annotation}});

    this.annotations = this.annotations.filter(function(el) {
        return el.date !== annotation.date;
    });
  }

  updateAnnotation() {
    console.log('UPDATE ANNOTATION');
    MeteorObservable.call('updateAnnotation', this.selectedAnnotation, this.version).subscribe({
      error: (e: Error) => {
        if (e) {
          console.log(e);
        }
      }
    });
  }

  deleteTempAnnotation(annotation) {
    this.annotations = this.annotations.filter(function(el) {
        return el.date !== annotation.date;
    });
  }

  deleteAnnotation(annotation) {
    Versions.update(
      { "_id": this.version._id },
      { "$pull": { 'comments': { date: new Date(annotation.date) } } }
    );
  }
}
