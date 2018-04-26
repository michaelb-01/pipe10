import { Component, OnInit, Input } from '@angular/core';

import { AnnotationService } from '../annotation/annotation.service';

@Component({
  selector: 'app-annotation-item',
  templateUrl: './annotation-item.component.html',
  styleUrls: ['./annotation-item.component.scss'],
  //providers: [AnnotationService]
})
export class AnnotationItemComponent implements OnInit {
  @Input() annotation;

  deleting:boolean = false;

  constructor(private annotationService: AnnotationService) { }

  ngOnInit() {
  }

  // ANNOTATION MOUSE EVENTS
  annotationMouseDown(annotation) {
    console.log('annotation mouse down');

    this.annotationService.dragging = true;
    //this.selectedAnnotation = annotation;

    //this.updateContainerDimensions();
  }

  annotationMouseUp(annotation) {
    this.annotationService.dragging = false;
  }

  textContainerMouseDown(event) {

  }

  createAnnotation(event) {
    this.annotationService.dragging = true;
  }

  deleteAnnotation(annotation) {
    
  }

}
