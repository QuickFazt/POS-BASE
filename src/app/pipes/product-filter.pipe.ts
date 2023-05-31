import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../models/product.model';

@Pipe({
  name: 'productFilter'
})
export class ProductFilterPipe implements PipeTransform {

  transform(products: Product[], texto: string): Product[] {
    if(texto.length === 0){
      return products;
    }
    texto = texto.toLocaleLowerCase();

    return products.filter(product => {
       
      return product.name.toLocaleLowerCase().includes(texto);
    });
  }
}
