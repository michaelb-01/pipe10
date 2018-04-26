import { Component, OnInit, Input, OnChanges, ViewChild, NgZone } from '@angular/core';
import { Version } from "../../../api/server/models/version";

import { ReviewService } from "../review.service";

@Component({
  selector: 'app-pipe-video',
  templateUrl: './pipe-video.component.html',
  styleUrls: ['./pipe-video.component.scss'],
  host: {
    '(document:mouseup)': 'onMouseUp($event)',
  }
})
export class PipeVideoComponent implements OnInit, OnChanges {
  @Input() version;

  @ViewChild('pipeVideo') pipeVideo: any;
  @ViewChild('seekBar') seekBar: any;

  fps:number = 25;
  numFrames:number = 25;
  frame:number = 1;
  time:number = 1;

  playing:boolean = false;

  // volume
  editingVolume:boolean = false;

  volumeBarInset:number = 0;
  selectedBar:number = 0;

  relUrl: string = '';

  seekPosition: number = 0;

  animFrame:any;

  // slider
  seek:number = 0;

  constructor(public ngZone: NgZone,
              public _reviewService: ReviewService) { }

  ngOnInit() {
    //this.relUrl = '/' + this.version.content.split('/').slice(-3).join("/");
  }

  ngOnChanges(changes) {
    if (changes.version.currentValue) {
      this.relUrl = changes.version.currentValue.content.split('/').slice(-4).join("/");
    }

    // changes.prop contains the old and the new value...
  }

  ///// UPDATE FRAME /////


  updateSeekbar(e) {
    console.log('update seekbar');
    //if (this._reviewService.playing == false) return;
    //this.seekBar.nativeElement.value = (100 / this.pipeVideo.nativeElement.duration) * this.pipeVideo.nativeElement.currentTime;
  }

  videoLoaded(event) {
    this.numFrames = event.target.duration * this.fps;
  }

  updateFrame() {
    this._reviewService.time = this.pipeVideo.nativeElement.currentTime;
    this._reviewService.frame = Math.round(this._reviewService.time * this.fps) + 1;  // frame rate of 25 fps

    // if (this._reviewService.playing == true) {
    //   this.seekBar.nativeElement.value = Math.round((this.pipeVideo.nativeElement.currentTime / this.pipeVideo.nativeElement.duration) * this.numFrames);
    // }

    this.animFrame = requestAnimationFrame(() => {
      this.updateFrame();
    });
  }

  ///// PLAYBAR CONTROLS /////

  seekBarMouseMove(e) {
    if (e.target.className != "seekBar") return;

    let xRatio = e.offsetX / e.target.offsetWidth;

    this.seekPosition = xRatio * 100;
   
    //this.xpos = Math.round(xRatio * this.numTiles) * this.xratio; 
  }

  playVideo() {
    // this.ngZone.runOutsideAngular(() => 
    this.animFrame = requestAnimationFrame(() => {
      this.updateFrame();
    });
    this.pipeVideo.nativeElement.play();
    this._reviewService.playing = true;
  }

  pauseVideo() {
    cancelAnimationFrame(this.animFrame);
    this.pipeVideo.nativeElement.pause();
    this._reviewService.playing = false;
  }

  togglePlay() {
    if (this.pipeVideo.nativeElement.paused) {
      this.playVideo();
    }
    else {
      this.pauseVideo();
    }
  }

  updateTime(e) {
    this._reviewService.time = (e.source.value-1) / this.fps;
    this._reviewService.frame = Math.round(this._reviewService.time * this.fps) + 1;  // frame rate of 25 fps

    this.pipeVideo.nativeElement.currentTime = this._reviewService.time;
  }

  // VOLUME
  volumeBarMouseDown(e,i) {
    this.editingVolume = true;
    this.volumeBarInsetFunc(e,i);
    return false;
  }
  
  volumeBarInsetFunc(e,i) {
    if (!this.editingVolume) return;

    let offset = e.target.offsetWidth - e.offsetX;
    this.volumeBarInset = e.offsetX;
    this.selectedBar = i;
  }

  onMouseUp(e) {
    this.editingVolume = false;
  } 

  // SEEKBAR
  seekbarClick(e) {
    let rect = this.seekBar.nativeElement.getBoundingClientRect();

    let newmin = 0;
    let newmax = 1;
    let oldmin = 0;
    let oldmax = rect.right - rect.left;
    let value = e.pageX - rect.left;

    let newvalue = (((value - oldmin) * (newmax - newmin)) / (oldmax - oldmin)) + newmin;
    let clampedvalue = this.clamp(newvalue,0,1);

    console.log('res: ' + newvalue);

    this.seek = clampedvalue;
  }

  fullscreen() {
    let video = this.pipeVideo.nativeElement;
    console.log('go fullscreen');

    if (video.requestFullscreen) {
      video.requestFullscreen();
    } else if (video.mozRequestFullScreen) {
      video.mozRequestFullScreen(); // Firefox
    } else if (video.webkitRequestFullscreen) {
      video.webkitRequestFullscreen(); // Chrome and Safari
    }
  }

  clamp = function(val, min, max) {
    return Math.min(Math.max(val, min), max);
  };

  commentClick(comment) {
    console.log(comment);
    this._reviewService.frame = comment.frame;
    this._reviewService.time = comment.frame / this.fps;

    this.pipeVideo.nativeElement.currentTime = this._reviewService.time;
  }

}
