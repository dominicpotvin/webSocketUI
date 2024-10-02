// src/app/components/step-motor/step-motor.component.ts
import { Component, Input, OnChanges, ChangeDetectionStrategy, ChangeDetectorRef, Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepMotor } from '../models/step-motor.model';

@Pipe({
  name: 'sevenSegmentHybride',
  standalone: true
})
export class SevenSegmentHybridePipe implements PipeTransform {
  transform(value: any): string {
    if (value === null || value === undefined) {
      return '0000.0000';
    }
    
    const num = Number(value);
    if (isNaN(num)) {
      return '0000.0000';
    }
    
    const [integerPart, decimalPart] = num.toString().split('.');
    const formattedIntegerPart = integerPart.padStart(4, '0');
    const formattedDecimalPart = (decimalPart || '0').padEnd(4, '0').slice(0, 4);
    
    return `${formattedIntegerPart}.${formattedDecimalPart}`;
  }
}

@Component({
  selector: 'app-step-motor',
  standalone: true,
  imports: [CommonModule, SevenSegmentHybridePipe],
  templateUrl: './step-motor.component.html',
  styleUrls: ['./step-motor.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StepMotorComponent implements OnChanges {
  @Input() isConnected: boolean = false;
  @Input() stepMotorData: StepMotor | null = null;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnChanges() {
    this.cdr.markForCheck();
  }

  get connectionStatus(): string {
    return this.isConnected ? 'Connected' : 'Disconnected';
  }
}