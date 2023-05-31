import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { AddProductFromListComponent, AddProductFromCodeComponent } from './components';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    ComponentsModule,
    PipesModule    
  ],
  declarations: [
    HomePage, 
    AddProductFromListComponent, 
    AddProductFromCodeComponent
  ]
})
export class HomePageModule {}
