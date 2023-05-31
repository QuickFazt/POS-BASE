import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController} from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-taxes',
  templateUrl: './taxes.component.html',
  styleUrls: ['./taxes.component.scss'],
})
export class TaxesComponent implements OnInit {

 form: FormGroup;  
  
  constructor(
    private formBuilder: FormBuilder,
    private firebaseService: FirebaseService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({    
      id: ['tax'],     
      taxPercent: [0, [Validators.required, Validators.min(0), Validators.max(100)]],               
    });  

    this.getTax();
  }

  getTax() {   

    this.firebaseService.getDataById('tax', 'tax').valueChanges()
      .subscribe(data => {
        console.log(data);
        
        if(data['taxPercent']){
          this.taxPercent.setValue(data['taxPercent']);
        }else{
          this.taxPercent.setValue(0);
        }
      }, error => {        
        console.log(error.message);
      });
  }

  async setTax() {
    const loading = await this.firebaseService.loader().create();
    await loading.present();

    this.firebaseService.addToCollectionById('tax', this.form.value).then(res => {

      this.firebaseService.Toast('¡Impuesto actualizado exitosamente!');
      this.modalController.dismiss();

      loading.dismiss();
    }, error => {
      this.firebaseService.Toast(error.message);
      loading.dismiss();
    });
  }

  get taxPercent() {
    return this.form.get('taxPercent');
  }

}
