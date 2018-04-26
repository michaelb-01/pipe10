import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-version-form',
  templateUrl: './version-form.component.html',
  styleUrls: ['./version-form.component.scss']
})
export class VersionFormComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  updateVersion() {
    console.log('update version');
  }

  onSubmit(form) {

  }
}
