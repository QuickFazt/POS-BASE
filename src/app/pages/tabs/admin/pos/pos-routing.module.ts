import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PosPage } from './pos.page';

const routes: Routes = [
  {
    path: '',
    component: PosPage
  },
  {
    path: 'pos-openings/:id/:number',
    loadChildren: () => import('./pos-openings/pos-openings.module').then( m => m.PosOpeningsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PosPageRoutingModule {}
