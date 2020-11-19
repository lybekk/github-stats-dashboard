import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrafficComponent } from './traffic.component';

describe('TrafficComponent', () => {
  let component: TrafficComponent;
  let fixture: ComponentFixture<TrafficComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrafficComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrafficComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
