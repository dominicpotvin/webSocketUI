import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepMotorComponent } from './step-motor.component';

describe('StepMotorComponent', () => {
  let component: StepMotorComponent;
  let fixture: ComponentFixture<StepMotorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepMotorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StepMotorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
