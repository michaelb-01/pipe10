import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VersionItemComponent } from './version-item.component';

describe('VersionItemComponent', () => {
  let component: VersionItemComponent;
  let fixture: ComponentFixture<VersionItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VersionItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VersionItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
