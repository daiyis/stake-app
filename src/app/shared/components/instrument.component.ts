import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { StockInstrument, PortfolioHolding } from '../models/stock.model';

export type InstrumentDisplayMode = 'holding' | 'list' | 'compact';
export type InstrumentSize = 'small' | 'medium' | 'large';

@Component({
  selector: 'app-instrument',
  templateUrl: './instrument.component.html',
  styleUrls: ['./instrument.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstrumentComponent {
  @Input() stock!: StockInstrument;
  @Input() holding?: PortfolioHolding;
  
  @Input() mode: InstrumentDisplayMode = 'list';
  @Input() size: InstrumentSize = 'medium';
  @Input() showLogo: boolean = true;
  @Input() showChange: boolean = true;
  @Input() showPrice: boolean = true;
  
  @Input() clickable: boolean = true;
  
  @Output() instrumentClick = new EventEmitter<StockInstrument>();

  onInstrumentClick() {
    if (this.clickable) {
      this.instrumentClick.emit(this.stock);
    }
  }

  get displayStock(): StockInstrument {
    return this.holding?.stock || this.stock;
  }

  get shares(): number {
    return this.holding?.shares || 0;
  }
}