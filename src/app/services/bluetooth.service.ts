import { Injectable } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { Observable, Subscription, from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class BluetoothService {

  printer = localStorage.getItem('printer');

  private connection: Subscription;
  private connectionCommunication: Subscription;
  private reader: Observable<any>;

  constructor(
    private bluetoothSerial: BluetoothSerial,
    private firebaseService: FirebaseService
  ) {

  }

  getPrinter(){
    return this.printer;
  }

  /**
   * Busca los dispositivos bluetooth disponibles, evalúa si es posible usar la funcionalidad
   * bluetooth en el dispositivo.
   * @return {Promise<Object>} Regresa una lista de los dispositivos que se localizaron.
   */
  searchBluetooth(): Promise<Object> {
    return new Promise((resolve, reject) => {
      this.bluetoothSerial.isEnabled().then(success => {
        this.bluetoothSerial.discoverUnpaired().then(response => {
          if (response.length > 0) {
            resolve(response);
          } else {
            reject('BLUETOOTH.NOT_DEVICES_FOUND');
          }
        }).catch((error) => {
          // console.log(`[bluetooth.service-41] Error: ${JSON.stringify(error)}`);
          reject('BLUETOOTH.NOT_AVAILABLE_IN_THIS_DEVICE');
        });
      }, fail => {
        // console.log(`[bluetooth.service-45] Error: ${JSON.stringify(fail)}`);
        reject('BLUETOOTH.NOT_AVAILABLE');
      });
    });
  }

  /**
   * Verifica si ya se encuentra conectado a un dispositivo bluetooth o no.
   */
  checkConnection() {
    return new Promise((resolve, reject) => {
      this.bluetoothSerial.isConnected().then(isConnected => {
        resolve('BLUETOOTH.CONNECTED');
      }, notConnected => {
        reject('BLUETOOTH.NOT_CONNECTED');
      });
    });
  }

  async checkPrinter() {
    return await this.checkConnection().then((data) => {
      if (data == 'BLUETOOTH.CONNECTED') {
        this.dataInOut(`\n`).subscribe(data => {
        }, err => {
          return false;
        });
        return true;
      } else {
        return false;
      }
    }).catch(error => {
      return false;
    });
  }

  /**
   * Se conceta a un dispostitivo bluetooth por su id.
   * @param id Es la id del dispositivo al que se desea conectarse
   * @return {Promise<any>} Regresa un mensaje para indicar si se conectó exitosamente o no.
   */
  deviceConnection(id: string): Promise<string> {
    // console.log('bluetooth id', id);
    return new Promise((resolve, reject) => {
      this.bluetoothSerial.isEnabled().then(success => {

        this.connection = this.bluetoothSerial.connect(id).subscribe(() => {
          console.log('bluetooth id try 1', id);
          
          resolve('BLUETOOTH.CONNECTED');
        }, fail0 => {
          setTimeout(() => {
            console.log('bluetooth id try 2', id);
            this.connection = this.bluetoothSerial.connect(id).subscribe(() => {
              
              resolve('BLUETOOTH.CONNECTED');
            }, fail1 => {
              // console.log(`[bluetooth.service-88] Error conexión: ${JSON.stringify(fail1)}`);
              reject('BLUETOOTH.CANNOT_CONNECT');
            });
          }, 2000);
        });

      }, fail => {
        // console.log(`[bluetooth.service-45] Error: ${JSON.stringify(fail)}`);
        reject('BLUETOOTH.NOT_AVAILABLE');
      });
    });
  }

  /**
   * Cierra el socket para la conexión con un dispositivo bluetooth.
   * @return {Promise<boolean>}
   */
  disconnect(): Promise<boolean> {
    return new Promise((result) => {
      if (this.connectionCommunication) {
        this.connectionCommunication.unsubscribe();
      }
      if (this.connection) {
        this.connection.unsubscribe();
      }
      // this.delBluetoothId();
      result(true);
    });
  }

  /**
   * Establece el socket para las comunicaciones seriales después de conectarse con un dispositivo
   * bluetooth.
   * @param message Es el texto que se desea enviar.
   * @returns {Observable<any>} Regresa el texto que llegue vía seria a través de la conexión
   * bluetooth al dispositivo, en caso de no existir una conexión regresa un mensaje indicando que:
   * _No estas conectado a ningún dispositivo bluetooth_.
   */
  dataInOut(message): Observable<any> {

  
    return Observable.create(observer => {

      this.bluetoothSerial.isConnected().then((isConnected) => {
      
        this.reader = from(this.bluetoothSerial.write(message)).pipe(mergeMap(() => {
          return this.bluetoothSerial.subscribeRawData();
        }));
       
        this.reader.subscribe(data => {
          observer.next(data);
          observer.complete();
        });
      }, notConected => {
        observer.next('BLUETOOTH.NOT_CONNECTED');
        observer.complete();
      });
    });

 

  }


}
