import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { NetworkService } from 'src/app/services/network.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  
  waitingUserData: boolean; 
  user = {} as User;
  userOpenings = [];
  inProgress: boolean;
  isConnected: BehaviorSubject<boolean>;

  constructor(
    private firebaseService: FirebaseService,
    private networkService: NetworkService
  ) {  
    this.isConnected = this.networkService.getNetworkStatus();
    this.networkService.getConnectNetwork();
    this.networkService.getDisconnectNetwork();
  }

  ngOnInit() { 
  }

  ionViewWillEnter() {
    this.user.id = localStorage.getItem('uid');
    this.user.role = localStorage.getItem('role');
  }

  ionViewDidEnter() {
    this.getCurentUser();
    this.getUserOpenings();
  }

  doRefresh(event) {
    setTimeout(() => {
      this.ionViewDidEnter();     
      event.target.complete();
    }, 500)
  }

  getCurentUser() {
    this.waitingUserData = true;

    this.firebaseService.getDataById('users', this.user.id).valueChanges()
      .subscribe(data => {
        this.waitingUserData = false;
        this.user.name = data['name'];
        this.user.lastname = data['lastname'];
        this.user.email = data['email'];
        this.user.dni = data['dni'];
        this.user.img = data['img'];
      }, error => {
        this.waitingUserData = false;
        console.log(error.message);
      });
  }

  getUserOpenings() {
  
    this.firebaseService.getCollectionConditional('pos_openings',
      ref => ref.where('cashierId', '==', this.user.id))
      .subscribe(data => {
       

        this.userOpenings = data.map(e => {
          return {
            id: e.payload.doc.id,           
            cashierId: e.payload.doc.data()['cashierId'],
            closingDate: e.payload.doc.data()['closingDate']         
          };
        });

        //======Valida si hay una apertura de caja en curso========
        if (this.userOpenings.filter(e => e.closingDate == 'En curso').length == 0) {
          this.inProgress = false;
        } else {
          this.inProgress = true;        
        }

      }, error => {
        console.log(error)
      });
  }

}
