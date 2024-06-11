import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HygrometerComponent } from './hygrometer.component';

describe('HygrometerComponent', () => {
  let component: HygrometerComponent;
  let fixture: ComponentFixture<HygrometerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HygrometerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HygrometerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
