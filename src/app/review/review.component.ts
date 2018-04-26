import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { MeteorObservable } from 'meteor-rxjs';

import { Version } from "../../../api/server/models/version";
import { Versions } from "../../../api/server/collections/versions";

import { ReviewService } from "../review.service";

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss'],
  providers: [ ReviewService ] 
})
export class ReviewComponent implements OnInit {
  version;

  paramsSub: Subscription;
  versionSub: Subscription;

  versionId: string;
  
  constructor(private route: ActivatedRoute,
              public _reviewService: ReviewService) { }

  ngOnInit() {
    this.paramsSub = this.route.params
      .subscribe(params => {
        this.versionId = params['versionId'];

        if (this.versionSub) {
          this.versionSub.unsubscribe();
        }

        this.versionSub = MeteorObservable.subscribe('versions', this.versionId).zone().subscribe(() => {
          MeteorObservable.autorun().subscribe(() => {
            //this.version = this._versionService.getVersionById(this.versionId);
            this.version = Versions.findOne(new Mongo.ObjectID(this.versionId));
          });
        });
      });

      if (!this.versionId) {
        console.log('entity id not found');
      } 
  }

}
