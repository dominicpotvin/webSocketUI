import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NgxGaugeModule } from 'ngx-gauge';
import { CommonModule } from '@angular/common';

enum NgxGaugeType {
  Full = 'full',
  Semi = 'semi',
  Arch = 'arch'
}

@Component({
  selector: 'app-hygrometer',
  standalone: true,
  imports: [CommonModule, NgxGaugeModule],
  templateUrl: './hygrometer.component.html',
  styleUrls: ['./hygrometer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HygrometerComponent {
  private _humStr: string = "";
  private _gaugeValue: number = 0;

  @Input() set humStr(value: string) {
    console.log('Setting new Humidity:', value);
    this._humStr = value;
    this.cdr.markForCheck();
  }
  get humStr(): string {
    return this._humStr;
  }

  @Input() set gaugeValue(value: number) {
    console.log('Setting new gauge value:', value);
    this._gaugeValue = Math.min(Math.max(value, this.gaugeMin), this.gaugeMax);
    this.cdr.markForCheck();
  }
  get gaugeValue(): number {
    return this._gaugeValue;
  }

  @Input() isConnected: boolean = false;

  constructor(private cdr: ChangeDetectorRef) {}

  gaugeMin = 0;
  gaugeMax = 100;
  gaugeUnits = '%';
  gaugeType = NgxGaugeType.Arch;
  thresholdConfig = {
    '0': {color: 'blue'},
    '30': {color: 'green'},
    '60': {color: 'orange'},
    '80': {color: 'red'}
  };

  get connectionStatus(): string {
    return this.isConnected ? 'Connected' : 'Disconnected';
  }
}