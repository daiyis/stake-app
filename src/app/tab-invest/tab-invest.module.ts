import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabInvestPage } from './tab-invest.page';
import { SharedModule } from '../shared/shared.module';

import { TabInvestPageRoutingModule } from './tab-invest-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    SharedModule,
    TabInvestPageRoutingModule,
  ],
  declarations: [TabInvestPage],
})
export class TabInvestPageModule {}
