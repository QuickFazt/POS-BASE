import { Pipe, PipeTransform } from '@angular/core';
import { Client } from '../models/client.model';

@Pipe({
  name: 'personFilter'
})
export class PersonFilterPipe implements PipeTransform {

  transform(persons: Client[], texto: string): Client[] {
    if(texto.length === 0){
      return persons;
    }
    texto = texto.toLocaleLowerCase();

    return persons.filter(person => {
       
      return person.dni.toLocaleLowerCase().includes(texto) || person.name.toLocaleLowerCase().includes(texto);
    });
  }
}

