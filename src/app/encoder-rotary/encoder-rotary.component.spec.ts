import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EncoderRotaryComponent } from './encoder-rotary.component';

describe('EncoderRotaryComponent', () => {
  let component: EncoderRotaryComponent;
  let fixture: ComponentFixture<EncoderRotaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EncoderRotaryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EncoderRotaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
