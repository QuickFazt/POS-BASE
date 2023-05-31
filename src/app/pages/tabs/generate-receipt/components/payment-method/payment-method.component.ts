import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ToastController } from '@ionic/angular';
import { Receipt } from 'src/app/models/receipt.model';
import { GenerateReceiptPage } from 'src/app/pages/tabs/generate-receipt/generate-receipt.page';
import { ReceiptService } from 'src/app/services/receipt.service';


@Component({
  selector: 'app-payment-method',
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.scss'],
})
export class PaymentMethodComponent implements OnInit {

  form: FormGroup;
  receipt: Receipt;
  cashierId: string;

  constructor(
    private formBuilder: FormBuilder,
    private generateReceipt: GenerateReceiptPage,
    private receiptService: ReceiptService,
    private toastController: ToastController,
    private alertController: AlertController
  ) { }

  ngOnInit() {

    this.form = this.formBuilder.group({
      amountReceived: [0, [Validators.required]],
      change: [0]
    });

    this.receipt = this.receiptService.getReceipt();
  }

  Submit() {
    if (this.Validator()) {
      this.confirm();
    }
  }

  async confirm() {
    const alert = await this.alertController.create({
      subHeader: '¿Estás seguro/a de realizar esta venta?',
      message: 'Verifica que todos los datos estén correctos antes de realizarla',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Confirmar',
          handler: () => {
            this.receiptService.SavePayment(this.form.value);
            this.generateReceipt.Step4();
            this.amountReceived.setValue(0);
          }
        }
      ]
    });

    await alert.present();
  }

  getChange() {

    if (this.receipt.total > this.amountReceived.value) {
      this.change.setValue(0.0);
    } else {
      this.change.setValue(this.amountReceived.value - this.receipt.total);
    }

    return this.change.value;
  }

  Validator() {
    if (this.receipt.total.toFixed(2) > this.amountReceived.value) {
            
      this.Toast('El monto recibido no puede ser menor al total a pagar');
      return false;
    }

    if (!this.form.valid) {
      this.Toast('Ingresa todos los campos correctamente');
      return false;
    }

    return true;
  }


  get amountReceived() {
    return this.form.get('amountReceived');
  }

  get change() {
    return this.form.get('change');
  }


  async Toast(message) {
    const toast = await this.toastController.create({
      message: message,
      position: 'middle',
      color: 'primary',
      duration: 1000
    });
    toast.present();
  }

}
