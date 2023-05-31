import { Injectable } from '@angular/core';
import { Opening } from '../models/opening.model';
import { Receipt } from '../models/receipt.model';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class OpeningsService {

  currentOpening = {} as Opening;

  constructor(private firebaseService: FirebaseService) { }


  getCurentOpening(id) {
    this.firebaseService.getDataById('pos_openings', id).valueChanges()
      .subscribe((data: Opening) => {

        this.currentOpening = data;
        this.currentOpening.id = id;

      }, error => {
        //this.firebaseService.Toast(error.message);
      });
  }

  async updateCurrentOpening(receipt: Receipt) {

    let newSale;

      newSale = {
        id: this.currentOpening.id,
        salesCounter: this.currentOpening.salesCounter + 1, 
        profit: this.currentOpening.profit + receipt.total,    
        total: this.currentOpening.total + receipt.total
      }
       

    return this.firebaseService.UpdateCollection('pos_openings', newSale);
  }

}
