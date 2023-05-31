import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { ComponentsModule } from './components/components.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CurrencyPipe, DatePipe, registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

//Firebase
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFireModule } from "@angular/fire";
import { AngularFireStorageModule } from '@angular/fire/storage';
import { environment } from "../environments/environment.prod";

import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Device } from '@awesome-cordova-plugins/device/ngx';

import { Network } from '@awesome-cordova-plugins/network/ngx';
import { Keyboard } from '@awesome-cordova-plugins/keyboard/ngx';
//App Location
//import es from '@angular/common/locales/es';
//registerLocaleData(es);

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    IonicModule.forRoot({ mode: 'md' }),
    BrowserModule,
    AppRoutingModule,
    ComponentsModule,
    NgbModule,
    AngularFireModule.initializeApp(environment.firebaseConfig, 'Primary'),    
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    HttpClientModule
  ],

  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    //{ provide: LOCALE_ID, useValue: 'es-MX' },
    BluetoothSerial,
    DatePipe,
    CurrencyPipe,
    BarcodeScanner,
    Device,
    Network,
    Keyboard
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
