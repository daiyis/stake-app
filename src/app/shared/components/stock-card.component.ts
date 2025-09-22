import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { StockInstrument } from '../../shared/models/stock.model';
import { InstrumentType } from './instrument-type.component';

@Component({
  selector: 'app-stock-card',
  templateUrl: './stock-card.component.html',
  styleUrls: ['./stock-card.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StockCardComponent {
  @Input() stock!: StockInstrument;
  @Input() showBuyButton: boolean = false;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() instrumentType: InstrumentType = 'Stock';
  @Output() cardClicked = new EventEmitter<StockInstrument>();

  onCardClick() {
    this.cardClicked.emit(this.stock);
  }

  getChangeColor(): string {
    return this.stock.changePercent.startsWith('+') ? 'success' : 'danger';
  }

  getChangeIcon(): string {
    return this.stock.changePercent.startsWith('+') ? 'trending-up' : 'trending-down';
  }
}