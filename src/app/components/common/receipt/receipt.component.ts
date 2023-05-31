import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Client } from 'src/app/models/client.model';
import { Receipt } from 'src/app/models/receipt.model';
import { BluetoothService } from 'src/app/services/bluetooth.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ReceiptService } from 'src/app/services/receipt.service';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.scss'],
})
export class ReceiptComponent implements OnInit {


  @Input() receipt: Receipt; 
  waiting: boolean;
  client = {} as Client;
  printer;
  constructor(
    private receiptService: ReceiptService,  
    private modalController: ModalController,
    private bluetooth: BluetoothService,
    private firebaseService: FirebaseService
  ) { }

  ngOnInit() {
    this.getClient();
    this.printer = localStorage.getItem('printer');
  }

  getClient() {
    this.waiting = true;

    this.firebaseService.getDataById('clients', this.receipt.clientId).valueChanges()
      .subscribe((data: Client) => {

        this.waiting = false;
        this.receiptService.client = data;
        this.client = data;
                
      }, error => {
        this.waiting = false;
        //this.firebaseService.Toast(error.message);
      });
  }

  Checked() {   
      this.modalController.dismiss();    
  }


  Print() {
if(this.printer){
  let receipt = this.receiptService.printReceipt(this.receipt);

  this.bluetooth.dataInOut(`${receipt}\n\n`).subscribe(data => {
    if (data !== 'BLUETOOTH.NOT_CONNECTED') {
      try {
        if (data) {
          receipt;
        }
      } catch (error) {
        // si no puede imprimir, desconectar el dispositivo porque posiblemente no es una impresora         

        console.log(`[bluetooth-168]: ${JSON.stringify(error)}`);
      }
      // this.presentToast(data);

    } else {

    }
  });
}else{
  this.firebaseService.Toast('No hay una impresora conectada.');
}
      
    
    
  }


}
