import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { Subject }    from 'rxjs/Subject';

@Injectable()
export class SidenavService {
  public sidenavRight: MatSidenav;

  private source = new Subject();

  sidenavTriggered = this.source.asObservable();

  constructor() { }

  public setSidenav(sidenav) {
    this.sidenavRight = sidenav;
  }

  toggleSidenavRight() {
    this.source.next();
  }
}
