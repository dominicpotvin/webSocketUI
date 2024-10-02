import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NgxGaugeModule } from 'ngx-gauge';
import { CommonModule } from '@angular/common';

enum NgxGaugeType {
  Full = 'full',
  Semi = 'semi',
  Arch = 'arch'
}

@Component({
  selector: 'app-speedometer',
  standalone: true,
  imports: [CommonModule, NgxGaugeModule],
  templateUrl: './speedometer.component.html',
  styleUrls: ['./speedometer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpeedometerComponent {
  private _rpmStr: string = "";
  private _gaugeValue: number = 0;

  @Input() set rpmStr(value: string) {
    console.log('Setting new RPM:', value);
    this._rpmStr = value;
    this.cdr.markForCheck();
  }
  @Input() isConnected: boolean = false;
  get connectionStatus(): string {
    return this.isConnected ? 'Connected' : 'Disconnected';
  } 

  get rpmStr(): string {
    return this._rpmStr;
  }


  @Input() set gaugeValue(value: number) {
    console.log('Setting new gauge value:', value);
    this._gaugeValue = value;
    this.cdr.markForCheck();
  }
  get gaugeValue(): number {
    return this._gaugeValue;
  }

  constructor(private cdr: ChangeDetectorRef) {}

  gaugeMin = 0;
  gaugeMax = 3000;
  gaugeUnits = 'rpm';
  gaugeType = NgxGaugeType.Arch;
  thresholdConfig = {
    '0': {color: 'green'},
    '1500': {color: 'orange'},
    '2500': {color: 'red'}
  };
}