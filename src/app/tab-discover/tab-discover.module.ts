import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabDiscoverPage } from './tab-discover.page';
import { SharedModule } from '../shared/shared.module';

import { TabDiscoverPageRoutingModule } from './tab-discover-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    SharedModule,
    TabDiscoverPageRoutingModule,
  ],
  declarations: [TabDiscoverPage],
})
export class TabDiscoverPageModule {}
