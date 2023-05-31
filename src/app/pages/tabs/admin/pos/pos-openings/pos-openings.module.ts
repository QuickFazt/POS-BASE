import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PosOpeningsPageRoutingModule } from './pos-openings-routing.module';

import { PosOpeningsPage } from './pos-openings.page';
import { OpeningDetailComponent, OpenPosComponent } from './components';
import { ComponentsModule } from 'src/app/components/components.module';
import { CurrencyMaskInputMode, NgxCurrencyModule } from "ngx-currency";

export const customCurrencyMaskConfig = {
  align: "left",
  allowNegative: true,
  allowZero: true,
  decimal: ",",
  precision: 2,
  prefix: "$ ",
  suffix: "",
  thousands: ".",
  nullable: true,
  min: null,
  max: null,
  inputMode: CurrencyMaskInputMode.FINANCIAL
};

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PosOpeningsPageRoutingModule,
    ComponentsModule,
    ReactiveFormsModule,
    NgxCurrencyModule,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig)
  ],
  declarations: [
    PosOpeningsPage,
    OpeningDetailComponent,
    OpenPosComponent
  ]
})
export class PosOpeningsPageModule { }
