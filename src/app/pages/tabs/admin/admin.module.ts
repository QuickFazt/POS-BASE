import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminPageRoutingModule } from './admin-routing.module';

import { AdminPage } from './admin.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { TaxesComponent } from './taxes/taxes.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    AdminPageRoutingModule,
    ComponentsModule
  ],
  declarations: [AdminPage, TaxesComponent]
})
export class AdminPageModule {}
