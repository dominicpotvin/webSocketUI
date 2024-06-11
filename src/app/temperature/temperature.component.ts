
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
  selector: 'app-temperature',
  standalone: true,
  templateUrl: './temperature.component.html',
  styleUrls: ['./temperature.component.scss'],
  imports: [NgxGaugeModule]

})
export class TemperatureComponent{

  @Input() tempStr: string = "";
  @Input() gaugeValue: number = 0;
  newTemp: number = 0;
  gaugeMin = 0;
  gaugeMax = 100; 
  gaugeUnits = 'temperature';
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
    this.webSocketService.getMessageObservable('temperature').subscribe(data => {
      this.tempStr = data;   
      this.getConnectionStatusMessage();  
    });
  }

  convertData(): void {
    this.newTemp= parseFloat(this.tempStr);
  }
  
  updateTemperature(newTemp: number): void {    
    this.gaugeValue = Math.min(Math.max(newTemp, this.gaugeMin), this.gaugeMax);
  }

  getConnectionStatusMessage(): string {
    return this.isConnected ? 'Connected' : 'Not connected';
  }

  disconnect(): void {
    this.webSocketService.disconnect();
  }
}
