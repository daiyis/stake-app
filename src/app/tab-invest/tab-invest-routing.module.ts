import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabInvestPage } from './tab-invest.page';

const routes: Routes = [
  {
    path: '',
    component: TabInvestPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabInvestPageRoutingModule {}
