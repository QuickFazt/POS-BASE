import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GenerateReceiptPage } from './generate-receipt.page';

const routes: Routes = [
  {
    path: '',
    component: GenerateReceiptPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GenerateReceiptPageRoutingModule {}
