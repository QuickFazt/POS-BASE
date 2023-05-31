import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BluetoothService } from 'src/app/services/bluetooth.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ReceiptService } from 'src/app/services/receipt.service';

@Component({
  selector: 'app-opening-detail',
  templateUrl: './opening-detail.component.html',
  styleUrls: ['./opening-detail.component.scss'],
})
export class OpeningDetailComponent implements OnInit {

  @Input() opening;
   printer;
  constructor(
    private modalController: ModalController,
    private receiptService: ReceiptService,
    private bluetooth: BluetoothService,
    private firebaseService: FirebaseService
    ) { }

  ngOnInit() {  
    this.printer = localStorage.getItem('printer');
  }

  Checked() {
    this.modalController.dismiss();
  }

  Print() {
if(this.printer){
    let opening = this.receiptService.printOpening(this.opening);

    this.bluetooth.dataInOut(`${opening}\n\n`).subscribe(data => {
      if (data !== 'BLUETOOTH.NOT_CONNECTED') {
        try {
          if (data) {
            opening;
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
