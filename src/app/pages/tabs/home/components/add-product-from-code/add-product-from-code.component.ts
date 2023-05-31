import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Platform } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ReceiptService } from 'src/app/services/receipt.service';


@Component({
  selector: 'app-add-product-from-code',
  templateUrl: './add-product-from-code.component.html',
  styleUrls: ['./add-product-from-code.component.scss'],
})
export class AddProductFromCodeComponent implements OnInit {

  @Input() products;
  @Input() waiting;

  constructor(
    private qr: BarcodeScanner,
    private router: Router,
    private receiptService: ReceiptService,
    private platform: Platform,
    private firebaseService: FirebaseService
  ) { }

  ngOnInit() {


  }

  ScanQr() {

    if (this.platform.is('cordova')) {
      this.qr.scan({ prompt: "Escanee el código QR" }).then(res => {

        const productId = res.text;

        for (let p of this.products) {
          if (productId == p.id) {
            this.receiptService.addProduct(p);
            this.router.navigateByUrl('/tabs/generate-receipt');
          }
        }
      });
    } else {
      this.firebaseService.Toast('Solo se puede escanear en un dispositivo con cámara');
    }


  }

}