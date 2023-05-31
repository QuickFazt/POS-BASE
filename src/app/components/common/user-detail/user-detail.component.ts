import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
})
export class UserDetailComponent implements OnInit {

  waitingUserData: boolean;
  user = {} as User;
  userOpenings = [];
  inProgress: boolean;
  isConnected: BehaviorSubject<boolean>;

  constructor(private firebaseService: FirebaseService) {

  }

  ngOnInit() {    
    this.getUserRole();
    this.getUserOpenings();
  }


  getUserRole() {
    this.firebaseService.getDataById('roles', this.user.id).valueChanges()
      .subscribe(data => {
        this.user.role = data['role'];
      }, error => {
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

