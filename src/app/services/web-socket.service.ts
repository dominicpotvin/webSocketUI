import { Injectable } from '@angular/core';
import SockJS from 'sockjs-client';
import { Client, IMessage } from '@stomp/stompjs';
import { BehaviorSubject } from 'rxjs';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private stompClient: Client | null = null;
  public connectionStatus: BehaviorSubject<string> = new BehaviorSubject<string>('Déconnecté');
  private messageSubjects: { [key: string]: Subject<string> } = {
    rpm: new Subject<string>(),
    temperature: new Subject<string>(),
    humidity: new Subject<string>()
  };

  constructor() {}

  public initializeWebSocketConnection(): void {
    const serverUrl = 'http://localhost:8088/ws';
    const ws = new SockJS(serverUrl);
    this.stompClient = new Client({
      webSocketFactory: () => ws,
      onConnect: () => {
        console.log('Connected');
        this.connectionStatus.next('Connecté');
        this.subscribeToMessages();
        console.log('Subscribed to messages');
        this.subscribeToTopic('rpm');
        this.subscribeToTopic('temperature');
        this.subscribeToTopic('humidity');
      },
      onDisconnect: () => {
        console.log('Disconnected');
        this.connectionStatus.next('Déconnecté');
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ', frame.headers['message']);
        console.error('Additional details: ', frame.body);
      },
      onWebSocketError: (error) => {
        console.error('WebSocket error: ', error);
      },
      onWebSocketClose: (event) => {
        console.log('WebSocket closed: ', event);
        this.connectionStatus.next('Déconnecté');
      }
    });

    this.stompClient.activate();
  }

  private subscribeToMessages(): void {
    if (this.stompClient) {
      this.stompClient.subscribe('/topic/message', (message: IMessage) => {
        console.log('Received message: ', message.body);
      });
    }
  }

  public disconnect(): void {
    if (this.stompClient) {
      this.stompClient.deactivate();
    }
  }

  public sendMessage(message: string): void {
    if (this.stompClient) {
      this.stompClient.publish({ destination: '/app/send/message', body: message });
    }
  }

  private subscribeToTopic(topic: string): void {
    if (this.stompClient) {
      this.stompClient.subscribe('/topic/' + topic, (message: IMessage) => {
        this.messageSubjects[topic].next(message.body);
      });
    }
  }

  public getMessageObservable(topic: string): Subject<string> {
    return this.messageSubjects[topic];
  }
}
