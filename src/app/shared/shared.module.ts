import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { StockCardComponent } from './components/stock-card.component';
import { InstrumentTypeComponent } from './components/instrument-type.component';
import { InstrumentComponent } from './components/instrument.component';
import { BuyOrderComponent } from './components/buy-order.component';

@NgModule({
  declarations: [
    StockCardComponent,
    InstrumentTypeComponent,
    InstrumentComponent,
    BuyOrderComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  exports: [
    StockCardComponent,
    InstrumentTypeComponent,
    InstrumentComponent,
    BuyOrderComponent
  ]
})
export class SharedModule { }