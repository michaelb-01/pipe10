import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GanttItemComponent } from './gantt-item.component';

describe('GanttItemComponent', () => {
  let component: GanttItemComponent;
  let fixture: ComponentFixture<GanttItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GanttItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GanttItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
