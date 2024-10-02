import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../components/ui/button';
import { CardComponent, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { SwitchComponent } from '../components/ui/switch';

@Component({
  selector: 'app-led',
  standalone: true,
  imports: [CommonModule, ButtonComponent, CardComponent, CardContent, CardHeader, CardTitle, SwitchComponent],
  templateUrl: './led.component.html',
  styleUrls: ['./led.component.css']
})
export class LedComponent {
  @Input() title: string = 'LED Control';
  @Input() isConnected: boolean = false;
  @Input() ledStateValue: string = 'close';
  @Output() ledToggle = new EventEmitter<string>();

  toggleLED(): void {
    if (this.isConnected) {
      const newState = this.ledStateValue === 'close' ? 'open' : 'close';
      this.ledToggle.emit(newState);
    }
  }

  get ledState(): boolean {
    return this.ledStateValue === 'open';
  }

  get connectionStatus(): string {
    return this.isConnected ? 'Connected' : 'Disconnected';
  }  
}