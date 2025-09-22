import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab-invest',
        loadChildren: () =>
          import('../tab-invest/tab-invest.module').then(
            (m) => m.TabInvestPageModule
          ),
      },
      {
        path: 'tab-discover',
        loadChildren: () =>
          import('../tab-discover/tab-discover.module').then(
            (m) => m.TabDiscoverPageModule
          ),
      },
      {
        path: '',
        redirectTo: '/tabs/tab-invest',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/tab-invest',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
