import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabsPageRoutingModule } from './tabs-routing.module';

import { TabsPage } from './tabs.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { PrintersComponent } from 'src/app/components/common/printers/printers.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabsPageRoutingModule,
    ComponentsModule
  ],
  declarations: [TabsPage],
  providers: [PrintersComponent]
})
export class TabsPageModule {}
