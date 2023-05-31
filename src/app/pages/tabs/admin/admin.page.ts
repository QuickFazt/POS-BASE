import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';

import { NetworkService } from 'src/app/services/network.service';
import { TaxesComponent } from './taxes/taxes.component';
import * as firebase from 'firebase';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {

  pages = [
    { name: 'POS', url: 'tabs/admin/pos', icon_external: 'pos.svg' },
    { name: 'Monedas', url: 'tabs/admin/currency', icon_external: 'currency.svg' },
    { name: 'Impuesto %', url: 'taxes', icon_external: 'tax.svg' },
    { name: 'Ventas', url: 'tabs/admin/sales', icon: 'stats-chart' },
    { name: 'Productos', url: 'tabs/admin/products', icon: 'cart-outline' },
    { name: 'Usuarios', url: 'tabs/admin/users', icon: 'people-outline' }
  ];
  
  isConnected: BehaviorSubject<boolean>;

  constructor(
    private modalController: ModalController,
    private router: Router,
    private networkService: NetworkService
  ) {
    this.isConnected = this.networkService.getNetworkStatus();
    this.networkService.getConnectNetwork();
    this.networkService.getDisconnectNetwork();    
  }

  ngOnInit() {
    firebase.initializeApp(environment.firebaseConfig, "Secondary");
  }


  GoTo(page) {
    if (page.url == "taxes") {
      this.setTax();
    } else {
      this.router.navigateByUrl(page.url)
    }
  }

  async setTax() {
    const modal = await this.modalController.create({
      component: TaxesComponent,
      cssClass: 'set-tax'
    });

    await modal.present();

  }

}
