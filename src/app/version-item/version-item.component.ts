import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-version-item',
  templateUrl: './version-item.component.html',
  styleUrls: ['./version-item.component.scss']
})
export class VersionItemComponent implements OnInit {
  @Input() version;

  constructor() { }

  ngOnInit() {
  }

}
