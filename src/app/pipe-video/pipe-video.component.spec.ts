import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PipeVideoComponent } from './pipe-video.component';

describe('PipeVideoComponent', () => {
  let component: PipeVideoComponent;
  let fixture: ComponentFixture<PipeVideoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PipeVideoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PipeVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
