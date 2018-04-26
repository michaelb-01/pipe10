import { Component, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { jobsData, usersData } from './gantt-data';
import { cal } from './calendar';

import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-gantt',
  templateUrl: './gantt.component.html',
  styleUrls: ['./gantt.component.scss']
})
export class GanttComponent implements OnInit {
  @ViewChild('container') container;

  // initialise calendar variables
  cal = cal;

  usersObs: Observable<Array<any>>;
  users;
  months = [];

  // event listeners
  mouseMoveFn;

  // mouse 
  offsetX;

  containerBbox;
  cellWidth = 30;

  today;

  days = [31,28,31,30,31,30,31,31,30,31,30,31];

  constructor(private renderer: Renderer2) {
    let date = new Date();
    this.today = date.getDay();
    console.log('get date:')
    console.log(date);
    console.log('today: ' + this.today);

    this.users = usersData;
    this.usersObs = Observable.of(usersData).map((users) => {
      users.forEach(user=>{
        user.jobs.forEach(job=>{
          let start = this.dateDiffInDays(date,job.startDate);
          let end = this.dateDiffInDays(date,job.endDate);
          job['startIndex'] = start,
          job['endIndex'] = end,
          job['length'] = end-start
        })
      })

      return users;
    });

    this.usersObs.subscribe(x=>{
      console.log(x);
    })
  }

  dateDiffInDays(a, b) {
    // Discard the time and time-zone information.
    var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / cal._MS_PER_DAY);
  }

  ngOnInit() {
    if (this.leapYear()) {
      cal.days[1] = 29;
    }
    this.initCalendar();

    this.updateContainer();
  }

  updateContainer() {
    this.containerBbox = this.container.nativeElement.getBoundingClientRect();
  }

  initCalendar() {
    let date = new Date();

    console.log('date:');
    console.log(date);

    console.log('day:');
    console.log(date.getDay());

    let year = date.getFullYear();
    let month = date.getMonth();

    let day = date.getDate()
    let daysInMonth = cal.days[month];

    let num = daysInMonth - day;

    let days = [];

    for (let i = day; i<=daysInMonth;i++) {
      days.push(i);
    }

    this.months.push({
      'name':cal.monthNames[month],
      'nameShort':cal.monthNamesShort[month],
      'startIndex':date.getDay(),
      'days':days
    });

    year = date.getFullYear();
    month = date.getMonth();

    days = [];

    for (let i = 1; i<=28-num;i++) {
      days.push(i);
    }

    console.log('year: ' + year);
    console.log('month: ' + month);

    var startDay = new Date(year + '-' + (month+2) + '-1');
    console.log(startDay);

    this.months.push({
      'name':cal.monthNames[month+1],
      'nameShort':cal.monthNamesShort[month+1],
      'startIndex':startDay.getDay(),
      'days':days
    });

    console.log(this.months);
  }

  daysInMonth (month?:number, year?:number) {
    if (month == undefined) {
      let date = new Date();
      month = date.getMonth();
      year = date.getFullYear();
    }

    return new Date(year, month, 0).getDate();
  }

  leapYear() {
    let year = new Date().getFullYear();

    return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
  }

  addMouseMoveListener(e) {
    this.offsetX = e.pageX;
    this.mouseMoveFn = this.renderer.listen('document', 'mousemove', (e) => {
    })
  }

  removeMouseMoveListener() {
    if (this.mouseMoveFn) {
      this.mouseMoveFn();
    }
  }

  setMouseMoveListener(e) {
    if (e) {
      this.addMouseMoveListener(e);
    }
    else {
      this.removeMouseMoveListener();
    }
  }

}