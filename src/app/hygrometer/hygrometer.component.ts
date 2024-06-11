
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
  selector: 'app-hygrometer',
  standalone: true,
  templateUrl: './hygrometer.component.html',
  styleUrls: ['./hygrometer.component.scss'],
  imports: [NgxGaugeModule]

})
export class HygrometerComponent{

  @Input() humStr: string = "";
  @Input() gaugeValue: number = 0;
  newHum: number = 0;
  gaugeMin = 0;
  gaugeMax = 100; 
  gaugeUnits = 'humidity';
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
    this.webSocketService.getMessageObservable('humidity').subscribe(data => {
      this.humStr = data;   
      this.getConnectionStatusMessage();  
    });
  }

  convertData(): void {
    this.newHum = parseFloat(this.humStr);
  }
  
  updateHumidity(newHum: number): void {    
    this.gaugeValue = Math.min(Math.max(newHum, this.gaugeMin), this.gaugeMax);
  }

  getConnectionStatusMessage(): string {
    return this.isConnected ? 'Connected' : 'Not connected';
  }

  disconnect(): void {
    this.webSocketService.disconnect();
  }
}
