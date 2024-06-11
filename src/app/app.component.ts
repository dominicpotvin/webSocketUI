import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import nécessaire pour ngClass
import { WebSocketService } from './services/web-socket.service';
import { SpeedometerComponent } from './speedometer/speedometer.component';
import { HygrometerComponent } from './hygrometer/hygrometer.component';
import { TemperatureComponent } from './temperature/temperature.component';
import { FormsModule } from '@angular/forms'; // Importez FormsModule

@Component({
    selector: 'app-root',
    standalone: true, // Composant autonome
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    imports: [
      CommonModule,
      FormsModule, // Ajoutez FormsModule ici
      SpeedometerComponent,
      TemperatureComponent,
      HygrometerComponent
    ] 
  })
export class AppComponent {
  title = 'WebSocket Client';
  state = 'Disconnected';
  rpm: string = 'En attente de données...';
  temperature: string = 'En attente de données...';
  humidity: string = 'En attente de données...';
  message: string = ''; // Ajoutez une propriété pour stocker le message

  calculatedGaugeRpmValue: number = 0;
  calculatedGaugeHumValue: number = 0;
  calculatedGaugeTempValue: number = 0;

  isConnected = false; // Ajoutez une propriété pour gérer l'état de connexion

  constructor(private webSocketService: WebSocketService) {}

  connect(): void {
    this.isConnected = true;
    this.state = 'Connected';
    this.webSocketService.initializeWebSocketConnection();
    this.subscribeToMessages();
  }

  private subscribeToMessages(): void {
    this.webSocketService.getMessageObservable('rpm').subscribe(data => {
      this.rpm = data;
      this.calculatedGaugeRpmValue = parseFloat(data);
    });
    this.webSocketService.getMessageObservable('temperature').subscribe(data => {
      this.temperature = data;
      this.calculatedGaugeTempValue = parseFloat(data);
    });
    this.webSocketService.getMessageObservable('humidity').subscribe(data => {
      this.humidity = data;
      this.calculatedGaugeHumValue = parseFloat(data);
    });
  }

  disconnect(): void {
    this.isConnected = false;
    this.state = 'Déconnecté';
    this.webSocketService.disconnect();
  }
  send(): void {
    this.webSocketService.sendMessage(this.message);
    this.message = ''; // Réinitialisez l'input après l'envoi
  }
}
