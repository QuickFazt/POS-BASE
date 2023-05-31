import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PosOpeningsPage } from './pos-openings.page';

const routes: Routes = [
  {
    path: '',
    component: PosOpeningsPage
  },   {
    path: 'sales/:id',
    loadChildren: () => import('./sales/sales.module').then( m => m.SalesPageModule)
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PosOpeningsPageRoutingModule {}
