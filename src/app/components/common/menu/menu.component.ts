import { Component, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { PrintersComponent } from '../printers/printers.component';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  pages = [
    { name: 'Impresoras', url: 'printer-list', icon: 'print-outline' },
    { name: 'Cerrar Sesión', url: 'logout', icon: 'log-out-outline' }
  ];

  sessionId: string;

  constructor(
    private modalController: ModalController,
    private firebaseService: FirebaseService,
    private popoverController: PopoverController,
  ) { }

  ngOnInit() {

  }

  GoTo(page) {
    this.popoverController.dismiss();
    if (page.url == "printer-list") {
      this.PrinterList();
    } else if (page.url == 'logout') {
      this.logOut();
    }
  }


  async logOut() {
    this.firebaseService.logout();
  }

  async PrinterList() {
    const modal = await this.modalController.create({
      component: PrintersComponent,
    });

    await modal.present();

  }
}
