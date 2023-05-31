import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [ 
      {
        path: 'home',
        loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
      },      
      {
        path: 'generate-receipt',
        loadChildren: () => import('./generate-receipt/generate-receipt.module').then( m => m.GenerateReceiptPageModule)
      },       
      {
        path: 'admin',
        loadChildren: () => import('./admin/admin.module').then( m => m.AdminPageModule)
      },
      {
      path: '',
      redirectTo: '/tabs/home',
      pathMatch: 'full'
      }
  ]
},
{
  path: '',
  redirectTo: '/tabs/home',
  pathMatch: 'full'
}, 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
