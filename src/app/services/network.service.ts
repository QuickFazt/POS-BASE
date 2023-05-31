import { Injectable } from '@angular/core';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  private networkConnected = new BehaviorSubject(true);

  constructor(
    private network: Network    
    ) { }


  
    getDisconnectNetwork(){      
      return  this.network.onDisconnect().subscribe(() => {      
        this.networkConnected.next(false);
      });    
    }

    getConnectNetwork(){
      return this.network.onConnect().subscribe(() => { 
        this.networkConnected.next(true);     
      });
    }

    getNetworkStatus(){
      return this.networkConnected;
    }
}
