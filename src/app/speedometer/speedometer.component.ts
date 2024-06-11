
import { WebSocketService } from '../services/web-socket.service';
import { Subscription } from 'rxjs';
import { NgxGaugeModule } from 'ngx-gauge';
import { Component, Input, SimpleChanges, OnChanges } from '@angular/core';


enum NgxGaugeType {
  Full = 'full',
  Semi = 'semi',
  Arch = 'arch'
}


@Component({
  selector: 'app-speedometer',
  standalone: true,
  templateUrl: './speedometer.component.html',
  styleUrls: ['./speedometer.component.scss'],
  imports: [NgxGaugeModule]

})
export class SpeedometerComponent {

  @Input() rpmStr: string = "";
  @Input() gaugeValue: number = 0;
  newRpm: number = 0;
  gaugeMin = 0;
  gaugeMax = 3000; 
  gaugeUnits = 'rpm';
  gaugeType = NgxGaugeType.Arch;

  thresholdConfig = {
    '0': {color: 'green'},
    '1500': {color: 'orange'},
    '2500': {color: 'red'}
};


  private wsSubscription: Subscription | undefined;

  private isConnected = false; 

  constructor(private webSocketService: WebSocketService) {}

  connect(): void {
    this.webSocketService.initializeWebSocketConnection();
    this.subscribeToMessages();
    
  }

  private subscribeToMessages(): void {
    this.webSocketService.getMessageObservable('rpm').subscribe(data => {
      this.rpmStr = data;   
      this.getConnectionStatusMessage();  
    });
  }

  convertData(): void {
    this.newRpm = parseFloat(this.rpmStr);
  }
  
  updateSpeed(newRpm: number): void {    
    this.gaugeValue = Math.min(Math.max(newRpm, this.gaugeMin), this.gaugeMax);
  }

  getConnectionStatusMessage(): string {
    return this.isConnected ? 'Connected' : 'Not connected';
  }

  disconnect(): void {
    this.webSocketService.disconnect();
  }
}
