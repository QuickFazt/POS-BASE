import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { PrintersComponent } from 'src/app/components/common/printers/printers.component';
import { ReceiptService } from 'src/app/services/receipt.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  itemCounter: BehaviorSubject<number>;
  printer;
  role: string;
  constructor(
    private receiptService: ReceiptService,
    private modalController: ModalController,
    private alertController: AlertController,
    private printerList: PrintersComponent,
    private router: Router 
  ) { }

  ngOnInit() {
    this.itemCounter = this.receiptService.getReceiptItemCount();
    this.printer = localStorage.getItem('printer');

    // if (!this.printer) {
    //   this.Alert();
    // } else {
    //   this.SelectPrinter();
    // }

  }

  ionViewWillEnter(){
   this.role = localStorage.getItem('role');
  }

  async Alert() {
    const alert = await this.alertController.create({
      message: 'Conecta una impresora para imprimir recibos de pago',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Conectar',
          handler: () => {
            this.PrinterList();
          }
        }
      ]
    });

    await alert.present();
  }

  SelectPrinter() {
    this.printerList.ConnectDevice(this.printer);
  }

  async PrinterList() {
    const modal = await this.modalController.create({
      component: PrintersComponent,
    });

    await modal.present();

  }
}
