import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NgxGaugeModule } from 'ngx-gauge';
import { CommonModule } from '@angular/common';

enum NgxGaugeType {
  Full = 'full',
  Semi = 'semi',
  Arch = 'arch'
}

@Component({
  selector: 'app-temperature',
  standalone: true,
  imports: [CommonModule, NgxGaugeModule],
  templateUrl: './temperature.component.html',
  styleUrls: ['./temperature.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemperatureComponent {
  private _tempStr: string = "";
  private _gaugeValue: number = 0;

  @Input() set tempStr(value: string) {
    console.log('Setting new Temperature:', value);
    this._tempStr = value;
    this.cdr.markForCheck();
  }
  get tempStr(): string {
    return this._tempStr;
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
  gaugeUnits = '°C';
  gaugeType = NgxGaugeType.Arch;
  thresholdConfig = {
    '0': {color: 'blue'},
    '20': {color: 'green'},
    '40': {color: 'orange'},
    '60': {color: 'red'}
  };

  get connectionStatus(): string {
    return this.isConnected ? 'Connected' : 'Disconnected';
  }
}