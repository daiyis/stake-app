import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

export type InstrumentType = 'Stock' | 'ETF';

@Component({
  selector: 'app-instrument-type',
  templateUrl: './instrument-type.component.html',
  styleUrls: ['./instrument-type.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstrumentTypeComponent {
  @Input() type: InstrumentType = 'Stock';

  get displayText(): string {
    return this.type.toString();
  }

  get cssClass(): string {
    return `instrument-type instrument-type--${this.type}`;
  }
}