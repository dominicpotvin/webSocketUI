// src/app/components/ui/card.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  template: `<div class="card"><ng-content></ng-content></div>`,
})
export class CardComponent {}

@Component({
  selector: 'app-card-content',
  standalone: true,
  template: `<div class="card-content"><ng-content></ng-content></div>`,
})
export class CardContent {}

@Component({
  selector: 'app-card-header',
  standalone: true,
  template: `<div class="card-header"><ng-content></ng-content></div>`,
})
export class CardHeader {}

@Component({
  selector: 'app-card-title',
  standalone: true,
  template: `<h2 class="card-title"><ng-content></ng-content></h2>`,
})
export class CardTitle {}