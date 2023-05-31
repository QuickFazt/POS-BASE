import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PosPageRoutingModule } from './pos-routing.module';

import { PosPage } from './pos.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PosPageRoutingModule,
    ComponentsModule
  ],
  declarations: [PosPage]
})
export class PosPageModule {}
