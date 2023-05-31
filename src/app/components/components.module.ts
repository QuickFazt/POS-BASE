import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HeaderRegularComponent } from './common/header-regular/header-regular.component';
import { MenuComponent } from './common/menu/menu.component';
import { PrintersComponent } from './common/printers/printers.component';
import { ReceiptComponent } from './common/receipt/receipt.component';
import { UserDetailComponent } from './common/user-detail/user-detail.component';


@NgModule({
  declarations: [
    ReceiptComponent,
    HeaderRegularComponent,
    MenuComponent,
    PrintersComponent,
    UserDetailComponent
  ],

  exports: [
    ReceiptComponent,
    HeaderRegularComponent,
    MenuComponent,
    PrintersComponent,
    UserDetailComponent
  ],

  imports: [
    CommonModule,
    IonicModule
  ]
})
export class ComponentsModule { }
