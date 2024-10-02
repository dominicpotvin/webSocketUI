// src/app/components/ui/switch.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-switch',
  standalone: true,
  imports: [CommonModule],
  template: `
    <label class="switch">
      <input type="checkbox"
             [checked]="checked"
             (change)="onToggle()"
             [disabled]="disabled">
      <span class="slider" [class.round]="isRound"></span>
    </label>
  `,
  styles: [`
    .switch {
      position: relative;
      display: inline-block;
      width: 60px;
      height: 34px;
    }

    .switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ccc;
      transition: .4s;
    }

    .slider:before {
      position: absolute;
      content: "";
      height: 26px;
      width: 26px;
      left: 4px;
      bottom: 4px;
      background-color: white;
      transition: .4s;
    }

    input:checked + .slider {
      background-color: #2196F3;
    }

    input:focus + .slider {
      box-shadow: 0 0 1px #2196F3;
    }

    input:checked + .slider:before {
      transform: translateX(26px);
    }

    .slider.round {
      border-radius: 34px;
    }

    .slider.round:before {
      border-radius: 50%;
    }

    input:disabled + .slider {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
})
export class SwitchComponent {
  @Input() checked: boolean = false;
  @Input() disabled: boolean = false;
  @Input() isRound: boolean = true;
  @Output() checkedChange = new EventEmitter<boolean>();

  onToggle() {
    if (!this.disabled) {
      this.checked = !this.checked;
      this.checkedChange.emit(this.checked);
    }
  }
}