import { Component, OnInit, ChangeDetectorRef, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { WebSocketService } from './services/web-socket.service';
import { FormsModule } from '@angular/forms';
import { SpeedometerComponent } from './speedometer/speedometer.component';
import { HygrometerComponent } from './hygrometer/hygrometer.component';
import { TemperatureComponent } from './temperature/temperature.component';
import { LedComponent } from './led/led.component';
import { EncoderRotaryComponent } from './encoder-rotary/encoder-rotary.component';
import { StepMotorComponent } from './step-motor/step-motor.component';
import { StepMotor } from './models/step-motor.model';
import { MySevenSegmentComponent } from 'my-seven-segment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SpeedometerComponent,
    TemperatureComponent,
    HygrometerComponent,
    LedComponent,
    StepMotorComponent,
    EncoderRotaryComponent,
    MySevenSegmentComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'WebSocket Client';
  state1 = 'Disconnected';
  state2 = 'Disconnected';
  state3 = 'Disconnected';
  stateSSE = 'Disconnected';

  rpm: string = 'En attente de données...';
  temperature: string = 'En attente de données...';
  humidity: string = 'En attente de données...';

  led: string = 'En attente de données...';

  positionEncoder: string = '0';
  speedEncoder: string = 'En attente de données...';

  stepMotorData: StepMotor | null = null;
  encoderRotaryData: any = null;

  message: string = '';

  calculatedGaugeRpmValue: number = 0;
  calculatedGaugeHumValue: number = 0;
  calculatedGaugeTempValue: number = 0;

  viewStateToggle: string = 'close';
  isConnected1 = false;
  isConnected2 = false;
  isConnected3 = false;
  isConnectedSSE = false;

  PositionFromWebSocket: string = '0';
  PosTitle = 'X Postion';

  XvalueFromWebSocket: string = '0';
  XaxisTitle = 'X AXIS';

  YvalueFromWebSocket: string = '0';
  YaxisTitle = 'Y AXIS';

  ZvalueFromWebSocket: string = '0';
  ZaxisTitle = 'Z AXIS';

  private destroyRef = inject(DestroyRef);

  constructor(private webSocketService: WebSocketService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    // Si vous voulez vous abonner aux messages dès le démarrage, décommentez ces lignes
    this.subscribeToMessagesServer1();
    this.subscribeToMessagesServer2();
    this.subscribeToMessagesServer3();
    this.subscribeToSSEUpdates();
  }

  connectToServer1(): void {
    this.webSocketService.initializeWebSocketConnectionServer1('server1');
    this.isConnected1 = true;
    this.state1 = 'Connected';
    this.subscribeToMessagesServer1();
  }

  connectToServer2(): void {
    this.webSocketService.initializeWebSocketConnectionServer2('server2');
    this.isConnected2 = true;
    this.state2 = 'Connected';
    this.subscribeToMessagesServer2();
  }

  connectToServer3(): void {
    this.webSocketService.initializeWebSocketConnectionServer3('server3');
    this.isConnected3 = true;
    this.state3 = 'Connected';
    this.subscribeToMessagesServer3();
  }

  connectToSSEServer(): void {
    this.webSocketService.initializeSSEConnection('serverSSE');
    this.isConnectedSSE = true;
    this.subscribeToSSEUpdates();
  }

  disconnectFromServer1(): void {
    this.webSocketService.disconnect('server1');
    this.isConnected1 = false;
    this.state1 = 'Disconnected';
  }

  disconnectFromServer2(): void {
    this.webSocketService.disconnect('server2');
    this.isConnected2 = false;
    this.state2 = 'Disconnected';
  }

  disconnectFromServer3(): void {
    this.webSocketService.disconnect('server3');
    this.isConnected3 = false;
    this.state3 = 'Disconnected';
  }

  disconnectFromSSEServer(): void {
    this.webSocketService.disconnect('serverSSE');
    this.isConnectedSSE = false;
    this.stateSSE = 'Disconnected';
    this.stepMotorData = null;
    this.encoderRotaryData = null;
  }

  private subscribeToMessagesServer1(): void {
    this.webSocketService.getMessageObservable('rpm').subscribe(data => {
      this.rpm = data;
      this.calculatedGaugeRpmValue = parseFloat(data);
      this.XvalueFromWebSocket = this.calculatedGaugeRpmValue.toString();
      this.cdr.detectChanges();
    });
    this.webSocketService.getMessageObservable('temperature').subscribe(data => {
      this.temperature = data;
      this.calculatedGaugeTempValue = parseFloat(data);
      this.YvalueFromWebSocket = this.calculatedGaugeTempValue.toString();
      this.cdr.detectChanges();
    });
    this.webSocketService.getMessageObservable('humidity').subscribe(data => {
      this.humidity = data;
      this.calculatedGaugeHumValue = parseFloat(data);
      this.ZvalueFromWebSocket = this.calculatedGaugeHumValue.toString();
      this.cdr.detectChanges();
    });
  }

  private subscribeToMessagesServer2(): void {
    this.webSocketService.getMessageObservable('led')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => {
        this.led = data;
        this.viewStateToggle = data === 'open' ? 'open' : 'close';
      });
  }

  private subscribeToMessagesServer3(): void {
    this.webSocketService.getMessageObservable('positionEncoder').subscribe(data => {
      this.positionEncoder = `${data}`;
      this.cdr.detectChanges();
    });
    this.webSocketService.getMessageObservable('speedEncoder').subscribe(data => {
      this.speedEncoder = `Speed: ${data}`;
      this.cdr.detectChanges();
    });
  }
   

  private subscribeToSSEUpdates(): void {
    if (!this.isConnectedSSE) return;

    this.webSocketService.getMessageObservable('stepMotor')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data: StepMotor) => {
          this.stepMotorData = data;
          this.cdr.detectChanges();
        },
        error: (error) => console.error('Error in stepMotor subscription:', error)
      });

    this.webSocketService.getMessageObservable('encoderRotary')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data: any) => {
          this.encoderRotaryData = data;
          this.cdr.detectChanges();
        },
        error: (error) => console.error('Error in encoderRotary subscription:', error)
      });

    // S'abonner aux changements de statut de connexion
    this.webSocketService.connectionStatuses['serverSSE']
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(status => {
        this.stateSSE = status;
        this.isConnectedSSE = status === 'Connecté';
        this.cdr.detectChanges();
      });
  }

  sendToServer1(): void {
    if (this.isConnected1) {
      this.webSocketService.sendMessage('server1', this.message);
      this.message = '';
    }
  }

  sendToServer2(): void {
    if (this.isConnected2) {
      this.webSocketService.sendMessage('server2', this.message);
      this.message = '';
    }
  }

  sendToServer3(): void {
    if (this.isConnected3) {
      this.webSocketService.sendMessage('server3', this.message);
      this.message = '';
    }
  }

  onLedToggle(newState: string): void {
    if (this.isConnected2) {
      this.viewStateToggle = newState;
      this.webSocketService.controlLED('server2', newState);
    }
  }

  sendToSSEServer(): void {
    if (this.isConnectedSSE) {
      this.webSocketService.sendMessage('serverSSE', this.message);
      this.message = '';
    }
  }
}
