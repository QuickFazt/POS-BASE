import { CurrencyPipe, DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { Client } from '../models/client.model';
import { Opening } from '../models/opening.model';
import { Product } from '../models/product.model';
import { Receipt } from '../models/receipt.model';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class ReceiptService {

  receipt = {} as Receipt;
  client = {} as Client;

  private receiptItemCount = new BehaviorSubject(0);
  private assignedOpening = new BehaviorSubject(false);

  constructor(
    private toastController: ToastController,
    private datePipe: DatePipe,
    private currencyPipe: CurrencyPipe,
    private firebaseService: FirebaseService
  ) {

    this.receipt.products = [];
  }


  getAssignedOpening() {
    return this.assignedOpening;
  }

  getClient() {
    return this.client;
  }

  getReceipt() {
    return this.receipt;
  }

  SaveClient(clientId) {
    this.receipt.clientId = clientId;
  }

  SavePayment(payment) {
    this.receipt.amountReceived = payment.amountReceived;
    this.receipt.change = payment.change;
  }

  getReceiptItemCount() {
    return this.receiptItemCount;
  }

  getSubtotal() {
    return this.receipt.products.reduce((i, j) => i + j.price * j.quantity, 0);
  }

  async UpdateStock(product) {

    let p = { id: product.id, stock: product.stock };

    const loading = await this.firebaseService.loader().create();
    await loading.present();
    this.firebaseService.UpdateCollection('products', p).then(res => {
      loading.dismiss();
    }, error => {
      this.Toast('Ha ocurrido un error, intente de nuevo')
      loading.dismiss();
    })
  }

  async addProduct(product: Product) {

    if (this.assignedOpening.value) {

      let added = false;
      for (let p of this.receipt.products) {
        if (p.id === product.id) {
          if (p.stock > 0) {
            product.stock = product.stock - 1;
            p.quantity += 1;
            added = true;
            this.UpdateStock(product);
            this.receiptItemCount.next(this.receiptItemCount.value + 1);
            break;
          } else {
            this.Toast('No hay disponibilidad de este producto');
            added = true;
            break;
          }
        }
      }
      if (!added) {
        product.stock = product.stock - 1;
        product.quantity = 1;
        this.receipt.products.push(product);
        this.receipt.img = product.image;
        this.UpdateStock(product);
        this.receiptItemCount.next(this.receiptItemCount.value + 1);
      }

    } else {
      this.Toast('No tienes ninguna apertura de caja asignada para generar ventas.');
    }

  }


  async decreaseProduct(product) {
    for (let [index, p] of this.receipt.products.entries()) {
      if (p.id === product.id) {
        product.stock = product.stock + 1;
        p.quantity -= 1;

        if (p.quantity == 0) {
          this.receipt.products.splice(index, 1);
        }
      }
    }

    this.UpdateStock(product);
    this.receiptItemCount.next(this.receiptItemCount.value - 1);

  }

  async removeProduct(product) {
    for (let [index, p] of this.receipt.products.entries()) {
      if (p.id === product.id) {
        product.stock = product.stock + p.quantity;
        this.receiptItemCount.next(this.receiptItemCount.value - p.quantity);
        this.receipt.products.splice(index, 1);
      }
    }

    this.UpdateStock(product);

  }

  removeAll() {
    this.receiptItemCount.next(this.receiptItemCount.value * 0);
    this.receipt.products.splice(0, this.receipt.products.length)    
  }


  successMessage() {
    let text = '';
    text += commands.TEXT_FORMAT.TXT_ALIGN_CT;

    text += '';
    text += commands.EOL;
    text += commands.EOL;
    text += commands.EOL;
    return this.clearString(text);
  }

  printReceipt(receipt: Receipt) {
    let text = '';

    const amount_received = this.currencyPipe.transform(receipt.amountReceived, ' ') + ' USD';
    const change = this.currencyPipe.transform(receipt.change, ' ') + ' USD';
    const tax = this.currencyPipe.transform(receipt.tax, ' ') + ' USD';
    const subtotal = this.currencyPipe.transform(receipt.subtotal, ' ') + ' USD';
    const total = this.currencyPipe.transform(receipt.total, ' ');

    text += commands.TEXT_FORMAT.TXT_NORMAL;
    text += commands.TEXT_FORMAT.TXT_ALIGN_CT;

    text += 'RECIBO';
    text += commands.EOL;

    text += commands.TEXT_FORMAT.TXT_ALIGN_LT;
    text += 'Fecha: ' + receipt.date + ' ' + receipt.hour;
    text += commands.EOL;
    text += commands.EOL;

    text += commands.TEXT_FORMAT.TXT_ALIGN_LT;
    text += 'Cliente: ';
    text += commands.EOL;

    text += commands.TEXT_FORMAT.TXT_ALIGN_LT;
    text += this.client.name + ' ' + this.client.lastname;
    text += commands.EOL;
    text += commands.TEXT_FORMAT.TXT_ALIGN_LT;
    text += 'DNI: ' + this.client.dni;
    text += commands.EOL;
    text += '__________________';
    text += commands.EOL;


    text += commands.TEXT_FORMAT.TXT_ALIGN_LT;
    text += 'Productos:';
    text += commands.EOL;
    text += '__________________';
    text += commands.EOL;

    for (let p of receipt.products) {
      text += commands.TEXT_FORMAT.TXT_ALIGN_LT;
      text += p.name;
      text += commands.EOL;
      text += p.quantity + ' x ' + this.currencyPipe.transform(p.price, ' ') + ' USD';
      text += commands.EOL;
      text += '--------------------';
      text += commands.EOL;
    }

    text += commands.TEXT_FORMAT.TXT_ALIGN_LT;
    text += 'Monto Recibido: ' + amount_received;
    text += commands.EOL;

    if (change) {
      text += commands.TEXT_FORMAT.TXT_ALIGN_LT;
      text += 'Vuelto: ' + change;
      text += commands.EOL;
      text += commands.EOL;
    }

    if (tax) {
      text += commands.TEXT_FORMAT.TXT_ALIGN_LT;
      text += 'Impuesto (' + receipt.taxPercent + '%): ' + tax;
      text += commands.EOL;
    }
    if (subtotal !== total) {
      text += commands.TEXT_FORMAT.TXT_ALIGN_LT;
      text += 'Subtotal: ' + subtotal;
      text += commands.EOL;
    }

    text += commands.EOL;
    text += commands.TEXT_FORMAT.TXT_ALIGN_CT;

    text += 'Total USD: ' + total;
    text += commands.EOL;

    for (let c of receipt.currency) {
      text += 'Total ' + c.symbol + ': ' + this.currencyPipe.transform(receipt.total * c.price, ' ');
      text += commands.EOL;
    }

    text += commands.EOL;
    text += commands.EOL;

    return this.clearString(text);
  }


  printOpening(opening: Opening) {
    let text = '';

    text += commands.TEXT_FORMAT.TXT_NORMAL;
    text += commands.TEXT_FORMAT.TXT_ALIGN_CT;

    text += 'Pos #' + opening.posCounter + ' Apetura #' + opening.counter;
    text += commands.EOL;
    text += commands.EOL;

    text += commands.TEXT_FORMAT.TXT_ALIGN_LT;
    text += 'Fecha de Apertura: ' + opening.openingDate;
    text += commands.EOL;

    text += 'Hora de Apertura: ' + opening.openingHour;
    text += commands.EOL;

    text += '__________________';
    text += commands.EOL;

    if (opening.closingDate !== 'En curso') {
      text += commands.TEXT_FORMAT.TXT_ALIGN_LT;
      text += 'Fecha de Cierre: ' + opening.closingDate;
      text += commands.EOL;

      text += 'Hora de Cierre: ' + opening.closingHour;
      text += commands.EOL;
    } else {

      text += commands.TEXT_FORMAT.TXT_ALIGN_LT;
      text += 'Fecha de Cierre: ' + opening.closingDate;
      text += commands.EOL;
    }

    text += '__________________';
    text += commands.EOL;


    text += commands.TEXT_FORMAT.TXT_ALIGN_LT;
    text += 'Número Ventas: ' + opening.salesCounter;
    text += commands.EOL;

    text += commands.TEXT_FORMAT.TXT_ALIGN_LT;
    text += 'Ganancia: ' + this.currencyPipe.transform(opening.profit, ' ') + ' USD';
    text += commands.EOL;

    text += '__________________';
    text += commands.EOL;
    text += commands.EOL;

    text += commands.TEXT_FORMAT.TXT_ALIGN_LT;
    text += 'Base Inicial: ' + this.currencyPipe.transform(opening.initialBase, ' ') + ' USD';
    text += commands.EOL;
    text += commands.EOL;

    text += commands.TEXT_FORMAT.TXT_ALIGN_CT;
    text += 'Total: ' + this.currencyPipe.transform(opening.total, ' ') + ' USD';
    text += commands.EOL;
    text += commands.EOL;
    text += commands.EOL;


    return this.clearString(text);
  }

  clearString(data: string) {
    const ret = data.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    console.log('printer ticket: ', ret);

    return ret;
  }

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


export const commands = {
  LINE_LENGTH: 32,
  INFO: '\x1d\x49\x01',

  LF: '\x0a',
  ESC: '\x1b',
  FS: '\x1c',
  GS: '\x1d',
  US: '\x1f',
  FF: '\x0c',
  DLE: '\x10',
  DC1: '\x11',
  DC4: '\x14',
  EOT: '\x04',
  NUL: '\x00',
  EOL: '\n',
  TAB: '\x08',

  HORIZONTAL_LINE: {
    HR_58MM: '================================',
    HR2_58MM: '********************************'
  },
  FEED_CONTROL_SEQUENCES: {
    CTL_LF: '\x0a', // Print and line feed
    CTL_FF: '\x0c', // Form feed
    CTL_CR: '\x0d', // Carriage return
    CTL_HT: '\x09', // Horizontal tab
    CTL_VT: '\x0b', // Vertical tab
  },
  LINE_SPACING: {
    LS_DEFAULT: '\x1b\x32',
    LS_SET: '\x1b\x33'
  },
  HARDWARE: {
    HW_INIT: '\x1b\x40', // Clear data in buffer and reset modes
    HW_SELECT: '\x1b\x3d\x01', // Printer select
    HW_RESET: '\x1b\x3f\x0a\x00', // Reset printer hardware
  },
  CASH_DRAWER: {
    CD_KICK_2: '\x1b\x70\x00', // Sends a pulse to pin 2 []
    CD_KICK_5: '\x1b\x70\x01', // Sends a pulse to pin 5 []
  },
  MARGINS: {
    BOTTOM: '\x1b\x4f', // Fix bottom size
    LEFT: '\x1b\x6c', // Fix left size
    RIGHT: '\x1b\x51', // Fix right size
  },
  PAPER: {
    PAPER_FULL_CUT: '\x1d\x56\x00', // Full cut paper
    PAPER_PART_CUT: '\x1d\x56\x01', // Partial cut paper
    PAPER_CUT_A: '\x1d\x56\x41', // Partial cut paper
    PAPER_CUT_B: '\x1d\x56\x42', // Partial cut paper
  },
  TEXT_FORMAT: {
    TXT_NORMAL: '\x1b\x21\x00', // Normal text
    TXT_NORMAL_2: '\x1b\x21\x01', // Normal text
    TXT_2HEIGHT: '\x1b\x21\x10', // Double height text
    TXT_2WIDTH: '\x1b\x21\x20', // Double width text
    TXT_4SQUARE: '\x1b\x21\x30', // Double width & height text

    TXT_UNDERL_OFF: '\x1b\x2d\x00', // Underline font OFF
    TXT_UNDERL_ON: '\x1b\x2d\x01', // Underline font 1-dot ON
    TXT_UNDERL2_ON: '\x1b\x2d\x02', // Underline font 2-dot ON
    TXT_BOLD_OFF: '\x1b\x45\x00', // Bold font OFF
    TXT_BOLD_ON: '\x1b\x45\x01', // Bold font ON
    TXT_ITALIC_OFF: '\x1b\x35', // Italic font ON
    TXT_ITALIC_ON: '\x1b\x34', // Italic font ON
    TXT_FONT_A: '\x1b\x4d\x00', // Font type A
    TXT_FONT_B: '\x1b\x4d\x01', // Font type B
    TXT_FONT_C: '\x1b\x4d\x02', // Font type C
    TXT_ALIGN_LT: '\x1b\x61\x00', // Left justification
    TXT_ALIGN_CT: '\x1b\x61\x01', // Centering
    TXT_ALIGN_RT: '\x1b\x61\x02', // Right justification
  },

  line_det_01(text1: string, num: number) {
    let text = '';
    let left = '';
    const length = commands.LINE_LENGTH;

    text += text1;
    // left = num.toString();
    left = num.toFixed(3);

    text += ' '.repeat(length - (text.length + left.length)) + left;

    return text;
  }
}