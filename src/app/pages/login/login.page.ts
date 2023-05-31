import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, Platform, ToastController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ReceiptService } from 'src/app/services/receipt.service';
import { Device } from '@awesome-cordova-plugins/device/ngx';
import { DeviceDetectorService } from "ngx-device-detector";
import { NetworkService } from 'src/app/services/network.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  form: FormGroup;
  admin = [];
  waiting: boolean;
  role: string;
  isConnected: BehaviorSubject<boolean>;

  constructor(
    private formBuilder: FormBuilder,
    private firebaseService: FirebaseService,
    private toastController: ToastController,
    private modalController: ModalController,
    private receiptService: ReceiptService,
    private platform: Platform,
    private device: Device,
    private deviceService: DeviceDetectorService,
    private networkService: NetworkService
  ) {

    this.networkService.getConnectNetwork();
    this.networkService.getDisconnectNetwork();
    this.isConnected = this.networkService.getNetworkStatus();

  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: [''.toLowerCase(), [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

  }

  Submit() {
    if (this.form.valid) {
      this.Login();
    } else {
      this.Toast('Completa los campos correctamente')
    }
  }

  async Login() {
    const loading = await this.firebaseService.loader().create();
    await loading.present();
    this.firebaseService.Login(this.form.value).then(res => {

      this.getUserRole(res.user.uid);

      loading.dismiss();
    }, error => {
      this.firebaseService.Toast(error.message);
      loading.dismiss();
    });
  }



/**
 * @param uid id del usuario logueado.
 * Obtiene el rol del usuario y lo guarda en localstorage */

  async getUserRole(uid) {
    const loading = await this.firebaseService.loader().create();
    await loading.present();

    this.firebaseService.getDataById('roles', uid).valueChanges()
      .subscribe(data => {

        this.role = data['role'];
        localStorage.setItem('role', this.role);
        this.getUserOpenings(uid);

        this.form.reset();

        loading.dismiss();
      }, error => {
        loading.dismiss();
      });
  }

/**
 * @param uid id del usuario logueado.
 * Verfica si el usuario tiene aperturas de caja en curso y guarda el id de la apertura en localstorage */
  async getUserOpenings(uid) {
    let assignedOpening = this.receiptService.getAssignedOpening();
    let openings = [];
    const loading = await this.firebaseService.loader().create();
    await loading.present();
    this.firebaseService.getCollectionConditional('pos_openings',
      ref => ref.where('closingDate', '==', 'En curso')
                .where('cashierId', '==', uid))
                .subscribe(data => {

        openings = data.map(e => {
          return {
            id: e.payload.doc.id,
            cashierId: e.payload.doc.data()['cashierId']
          };
        });


        for (let o of openings) {
          if (o.cashierId == localStorage.getItem('uid')) {
            assignedOpening.next(true);
            localStorage.setItem('openingId', o.id)
          }
        }

        if (openings.length == 0) {
          assignedOpening.next(false);
        }

        this.firebaseService.routerLink().navigateByUrl('tabs/home');
        this.firebaseService.Toast('Bienvenido/a');
        loading.dismiss();

      }, error => {
        loading.dismiss();
      });
  }

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }


  async Toast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      position: 'bottom',
      duration: 1500,
      color: 'primary',
    });
    toast.present();


  }

}
