import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CurrencyPageRoutingModule } from './currency-routing.module';

import { CurrencyPage } from './currency.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { NgxCurrencyModule } from "ngx-currency";
import { EditCurrencyComponent, NewCurrencyComponent } from './components';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CurrencyPageRoutingModule,
    ComponentsModule,
    ReactiveFormsModule,
    NgxCurrencyModule
  ],
  declarations: [
    CurrencyPage,
    NewCurrencyComponent,
    EditCurrencyComponent
  ]
})
export class CurrencyPageModule {}
