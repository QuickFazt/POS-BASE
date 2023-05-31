import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductsByCategoryPageRoutingModule } from './products-by-category-routing.module';

import { ProductsByCategoryPage } from './products-by-category.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { EditProductComponent, OptionProductComponent, ProductDetailComponent } from './components';
import { PipesModule } from 'src/app/pipes/pipes.module';

import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { NgxBarcodeModule } from 'ngx-barcode';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductsByCategoryPageRoutingModule,
    ComponentsModule,
    ReactiveFormsModule,
    PipesModule,
    NgxQRCodeModule,
    NgxBarcodeModule
  ],
  declarations: [
    ProductsByCategoryPage,
    EditProductComponent,
    OptionProductComponent,
    ProductDetailComponent
  ]
})
export class ProductsByCategoryPageModule {}
