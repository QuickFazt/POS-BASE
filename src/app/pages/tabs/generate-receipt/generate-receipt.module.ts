import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GenerateReceiptPageRoutingModule } from './generate-receipt-routing.module';

import { GenerateReceiptPage } from './generate-receipt.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { AddedProductsComponent, PaymentMethodComponent, UserDataComponent } from './components';
import { PipesModule } from 'src/app/pipes/pipes.module';

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
    ReactiveFormsModule,
    IonicModule,
    GenerateReceiptPageRoutingModule,
    ComponentsModule,
    PipesModule,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig)
  ],
  declarations: [
    GenerateReceiptPage,
    AddedProductsComponent,
    PaymentMethodComponent,
    UserDataComponent]
})
export class GenerateReceiptPageModule { }
