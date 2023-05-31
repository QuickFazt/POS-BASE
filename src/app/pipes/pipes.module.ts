import { NgModule } from '@angular/core';
import { ProductFilterPipe } from './product-filter.pipe';
import { PersonFilterPipe } from './person-filter.pipe';

@NgModule({
  declarations: [
    ProductFilterPipe,   
    PersonFilterPipe
  ],

  exports: [
    ProductFilterPipe,
    PersonFilterPipe
  ]
})
export class PipesModule { }
