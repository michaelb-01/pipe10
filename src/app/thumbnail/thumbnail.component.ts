import { Component, AfterViewInit, Input } from '@angular/core';

import { Subject, Subscription, Observable } from "rxjs";
import { MeteorObservable } from "meteor-rxjs";

@Component({
  selector: 'app-thumbnail',
  templateUrl: './thumbnail.component.html',
  styleUrls: ['./thumbnail.component.scss']
})
export class ThumbnailComponent implements AfterViewInit {
  //@Input() thumbUrl;

  _seek:number;
  _thumbUrl:string;

  @Input() set seek(value: number) {
    this._seek = value;

    this.xpos = Math.round(value / 100.0 * this.numTiles) * this.xratio;
  }

  get seek(): number {
    return this._seek;
  }

  @Input() set thumbUrl(value: string) {
    this._thumbUrl = value;
    this.relUrl = value.split('/').slice(-4).join("/");
  }

  get thumbUrl(): string {
    return this._thumbUrl;
  }

  imageSrc = '';

  relUrl:string = '';

  image;
  imageSub: Observable<any>;

  src: any;

  tileWidth = 320;

  xpos = 0;
  xratio = 0;

  numTiles = 30;

  heightRatio = 56;
  marginTop = 0;

  hovering = false;

  constructor(){}

  ngOnInit() {
    //this.loadImage();

    this.relUrl = this.thumbUrl.split('/').slice(-4).join("/");
  }

  loadImage() {
    let image = new Image();
    image.addEventListener('load', (e) => this.handleImageLoad(e));
    //image.src = this.thumbUrl;

    MeteorObservable.call('readImage2', this.thumbUrl).subscribe((res) => {
        // Handle success and response from server!
        this.imageSrc = "data:image/jpg;base64," + res;
        image.src = this.imageSrc;
     }, (err) => {
       console.log('error');
       console.log(err);
       // Handle error
     });
  }

  ngAfterViewInit() {
    let url = this.thumbUrl;
    
    //once image is loaded, we need to find the image width
    let image = new Image();
    image.addEventListener('load', (e) => this.handleImageLoad(e));
    image.src = this.relUrl;
  }

  test() {
    console.log('test');
  }

  handleImageLoad(event): void {
    //this.image.url = this.thumbUrl;

    let imgWidth = 9600;// event.target.width;
    let imgHeight = 180;//event.target.height;
    let numTiles = imgWidth / this.tileWidth;

    this.numTiles = numTiles - 1;

    this.heightRatio = imgHeight / (imgWidth / numTiles) * 100;
    this.marginTop = (this.heightRatio - 56) * -0.5;

    this.xratio = 100.0 / this.numTiles;
  }

  handleImageLoad2(): void {
    let imgWidth = this.image.width;
    let numTiles = imgWidth / this.tileWidth;

    this.numTiles = numTiles - 1;

    this.heightRatio = this.image.height / (imgWidth / numTiles) * 100;
    this.marginTop = (this.heightRatio - 56) * -0.5;

    this.xratio = 100.0 / this.numTiles;
  }

  mouseenter(e) {
    this.hovering = true;
  }

  mousemove(e) {
    let xPerc = e.offsetX / e.target.offsetWidth;

    this.xpos = Math.round(xPerc * this.numTiles) * this.xratio; 
    //this.xPerc = xPerc * 100;

    e.stopPropagation();
    e.preventDefault();
    return false;
  }

  mousemoveFromOutside(e) {
    let xPerc = e.offsetX / e.target.offsetWidth;

    this.xpos = Math.round(xPerc * this.numTiles) * this.xratio; 
    //this.xPerc = xPerc * 100;

    e.stopPropagation();
    e.preventDefault();
    return false;
  }

}
