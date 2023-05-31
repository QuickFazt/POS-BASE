import { Component, Input, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { MenuComponent } from '../menu/menu.component';


@Component({
  selector: 'app-header-regular',
  templateUrl: './header-regular.component.html',
  styleUrls: ['./header-regular.component.scss'],
})
export class HeaderRegularComponent implements OnInit {

  @Input() title;
  @Input() backButton;
  @Input() backButtonModal;
  @Input() url;
  constructor(private modalController: ModalController,
    private popoverController: PopoverController) {    
   }

  ngOnInit() {}

  close(){
    this.modalController.dismiss();
  }

 
  async Menu(event) {
    const popover = await this.popoverController.create({
      component: MenuComponent,     
      event: event,
    });

    await popover.present();
  }
  }
