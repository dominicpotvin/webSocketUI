// src/app/services/web-socket.service.ts
import { Injectable, NgZone } from '@angular/core';
import SockJS from 'sockjs-client';
import { Client, IMessage } from '@stomp/stompjs';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { WEBSOCKET_CONFIG } from '../config/websocket.config';
import { StepMotor } from '../models/step-motor.model';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private stompClients: { [key: string]: Client } = {};
  private webSockets: { [key: string]: WebSocket } = {};
  private sseEventSources: { [key: string]: EventSource } = {};

  public connectionStatuses: { [key: string]: BehaviorSubject<string> } = {
    default: new BehaviorSubject<string>('Déconnecté'),
    server1: new BehaviorSubject<string>('Déconnecté'),
    server2: new BehaviorSubject<string>('Déconnecté'),
    serverSSE: new BehaviorSubject<string>('Déconnecté')
  };

  private messageSubjects: { [key: string]: Subject<any> } = {
    rpm: new Subject<string>(),
    temperature: new Subject<string>(),
    humidity: new Subject<string>(),
    led: new Subject<string>(),
    positionEncoder: new Subject<string>(),
    speedEncoder: new Subject<string>(),
    stepMotor: new Subject<StepMotor>(),
    encoderRotary: new Subject<any>()
  };

  constructor(private zone: NgZone) {}

  public initializeWebSocketConnectionServer1(serverName: string = 'server1'): void {
    const ws = new SockJS(WEBSOCKET_CONFIG.SERVER1_URL);
    this.stompClients[serverName] = new Client({
      webSocketFactory: () => ws,
      onConnect: () => {
        console.log(`Connected to ${serverName}`);
        this.connectionStatuses[serverName].next('Connecté');
        this.subscribeToTopic(serverName, 'rpm');
        this.subscribeToTopic(serverName, 'temperature');
        this.subscribeToTopic(serverName, 'humidity');
      },
      onDisconnect: () => {
        console.log(`Disconnected from ${serverName}`);
        this.connectionStatuses[serverName].next('Déconnecté');
      },
      onStompError: (frame) => {
        console.error(`Broker reported error on ${serverName}: `, frame.headers['message']);
        console.error('Additional details: ', frame.body);
      },
      onWebSocketError: (error) => {
        console.error(`WebSocket error on ${serverName}: `, error);
      },
      onWebSocketClose: (event) => {
        console.log(`WebSocket closed on ${serverName}: `, event);
        this.connectionStatuses[serverName].next('Déconnecté');
      }
    });

    this.stompClients[serverName].activate();
  }

  public initializeWebSocketConnectionServer2(serverName: string = 'server2'): void {
    const ws = new WebSocket(WEBSOCKET_CONFIG.SERVER2_URL);
    this.webSockets[serverName] = ws;

    ws.onopen = () => {
      console.log(`Connected to ${serverName}`);
      this.connectionStatuses[serverName].next('Connecté');
    };

    ws.onmessage = (event) => {
      this.messageSubjects['led'].next(event.data);
    };

    ws.onclose = () => {
      console.log(`Disconnected from ${serverName}`);
      this.connectionStatuses[serverName].next('Déconnecté');
    };

    ws.onerror = (error) => {
      console.error(`WebSocket error on ${serverName}: `, error);
    };
  }

  public initializeWebSocketConnectionServer3(serverName: string = 'server3'): void {
    const ws = new WebSocket(WEBSOCKET_CONFIG.SERVER3_URL);
    this.webSockets[serverName] = ws;
  
    ws.onopen = () => {
      console.log(`Connected to ${serverName}`);
      this.connectionStatuses[serverName].next('Connecté');
    };
  
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Data received:", data);
    
        if (data.encoders && data.encoders.length > 0) {
          this.messageSubjects['positionEncoder'].next(data.encoders[0].position);
          this.messageSubjects['speedEncoder'].next(data.encoders[0].speed);
        } else {
          console.error("Invalid encoders data structure:", data);
        }
      } catch (error) {
        console.error("Error parsing JSON:", error, event.data);
      }
    };
    
  
    ws.onclose = () => {
      console.log(`Disconnected from ${serverName}`);
      this.connectionStatuses[serverName].next('Déconnecté');
    };
  
    ws.onerror = (error) => {
      console.error(`WebSocket error on ${serverName}: `, error);
    };
  }
  

  public initializeSSEConnection(serverName: string = 'serverSSE'): void {
    const stepMotorEventSource = new EventSource(`${WEBSOCKET_CONFIG.SSE_URL}/stepMotor`);
    const encoderRotaryEventSource = new EventSource(`${WEBSOCKET_CONFIG.SSE_URL}/encoderRotary`);

    this.sseEventSources['stepMotor'] = stepMotorEventSource;
    this.sseEventSources['encoderRotary'] = encoderRotaryEventSource;

    stepMotorEventSource.onmessage = (event) => {
      this.zone.run(() => {
        console.log('Received stepMotor data:', event.data);
        const stepMotorData: StepMotor = JSON.parse(event.data);
        this.messageSubjects['stepMotor'].next(stepMotorData);
      });
    };

    encoderRotaryEventSource.onmessage = (event) => {
      this.zone.run(() => {
        console.log('Received encoderRotary data:', event.data);
        this.messageSubjects['encoderRotary'].next(JSON.parse(event.data));
      });
    };

    stepMotorEventSource.onerror = encoderRotaryEventSource.onerror = (error) => {
      console.error('SSE connection error:', error);
      this.connectionStatuses[serverName].next('Déconnecté');
    };

    stepMotorEventSource.onopen = encoderRotaryEventSource.onopen = () => {
      console.log('SSE connection opened');
      this.connectionStatuses[serverName].next('Connecté');
    };
  }

  public disconnect(serverName: string = 'default'): void {
    if (this.stompClients[serverName]) {
      this.stompClients[serverName].deactivate();
    }
    if (this.webSockets[serverName]) {
      this.webSockets[serverName].close();
    }
    if (serverName === 'serverSSE') {
      this.disconnectSSE();
    }
    this.connectionStatuses[serverName].next('Déconnecté');
  }

  private disconnectSSE(): void {
    Object.values(this.sseEventSources).forEach(eventSource => {
      if (eventSource) {
        eventSource.close();
      }
    });
    this.sseEventSources = {};
    console.log('All SSE connections closed');
  }

  public sendMessage(serverName: string = 'default', message: string): void {
    if (this.stompClients[serverName]) {
      this.stompClients[serverName].publish({ destination: '/app/send/message', body: message });
    }
  }

  public controlLED(serverName: string = 'server2', state: string): void {
    if (this.webSockets[serverName]) {
      this.webSockets[serverName].send(state);
    }
  }

  private subscribeToTopic(serverName: string, topic: string): void {
    if (this.stompClients[serverName]) {
      this.stompClients[serverName].subscribe('/topic/' + topic, (message: IMessage) => {
        console.log(`Received message on topic ${topic} from ${serverName}: `, message.body);
        this.messageSubjects[topic].next(message.body);
      });
    }
  }

  public getMessageObservable(topic: string): Observable<any> {
    return this.messageSubjects[topic].asObservable();
  }
}
