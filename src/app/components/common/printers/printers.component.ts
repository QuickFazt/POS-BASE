import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { BluetoothService } from 'src/app/services/bluetooth.service';
import { ReceiptService } from 'src/app/services/receipt.service';

@Component({
  selector: 'app-printers',
  templateUrl: './printers.component.html',
  styleUrls: ['./printers.component.scss'],
})
export class PrintersComponent implements OnInit {

  devices: any[] = [];
  showSpinner = false;
  isConnected = false;
  message = '';
  messages = [];

  testMsg = '\x0a';

  constructor(
    private bluetooth: BluetoothService,    
    private receiptService: ReceiptService,
    private toastController: ToastController,
    private modalController: ModalController
  ) {

  }

  /**
   * Carga parte del contenido después de inicializar el componente.
   */
  ngOnInit() {
    this.showSpinner = true;
    this.Toast('Selecciona una impresora');
    this.bluetooth.searchBluetooth().then((devices: Array<Object>) => {
      console.log('devices', devices);
      this.devices = devices;
      this.showSpinner = false;
    }, (error) => {
      console.log('ngOnInit error', error);

      this.showSpinner = false;
    });
  }

  /**
   * Cierra la conexión bluetooth.
   */
  disconnect(): Promise<boolean> {
    return new Promise(result => {
      this.isConnected = false;
      this.bluetooth.disconnect().then(response => {
        result(response);
      });
    });
  }

  /**
   * Al cerrar la aplicación se asegura de que se cierre la conexión bluetooth.
   */
  ngOnDestroy() {
    // this.disconnect();
  }

  /**
   * Busca los dispositivos bluetooth dispositivos al arrastrar la pantalla hacia abajo.
   * @param refresher
   */
  refreshBluetooth(refresher) {
    if (refresher) {
      this.bluetooth.searchBluetooth().then((successMessage: Array<Object>) => {
        console.log('devices successMessage', successMessage);
        this.devices = [];
        this.devices = successMessage;
        refresher.target.complete();
      }, fail => {

        refresher.target.complete();
      });
    }
  }

  ConnectDevice(id) {
    this.disconnect().then(() => {
      this.bluetooth.deviceConnection(id).then(success => {
        localStorage.setItem('printer', id);
        this.sendMessage();
        this.isConnected = true;
        this.modalController.dismiss();       
      }, fail => {
        this.isConnected = false;
        alert('Impresora no conectada');
      });
    });
  }

  /**
   * Permite enviar mensajes de texto vía serial al conectarse por bluetooth.
   */
  sendMessage() {
    let message = this.receiptService.successMessage();
    this.bluetooth.dataInOut(`${message}\n`).subscribe(data => {
      if (data !== 'BLUETOOTH.NOT_CONNECTED') {
        try {
          if (data) {
            message;
          }
        } catch (error) {
          // si no puede imprimir, desconectar el dispositivo porque posiblemente no es una impresora
          this.isConnected = false;

          console.log(`[bluetooth-168]: ${JSON.stringify(error)}`);
        }
        // this.presentToast(data);
        this.message = '';
      } else {

      }
    });
  }

  /**
   * Recupera la información básica del servidor para las graficas de lineas.
   * @param message
   */

   async Toast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1000,
      color: 'primary',
      position: 'middle'
    });
    toast.present();
  }

}