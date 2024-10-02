// src/app/components/encoder-rotary/encoder-rotary.component.ts
import { Component, Input, OnChanges, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EncoderRotary } from '../models/encoder-rotary.model';

@Component({
  selector: 'app-encoder-rotary',
  standalone: true,
  templateUrl: './encoder-rotary.component.html',
  styleUrls: ['./encoder-rotary.component.css'],
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EncoderRotaryComponent implements OnChanges {
  @Input() isConnected: boolean = false;
  @Input() encoderRotaryData: EncoderRotary | null = null;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnChanges() {
    this.cdr.markForCheck();
  }

  get connectionStatus(): string {
    return this.isConnected ? 'Connected' : 'Disconnected';
  }
}
