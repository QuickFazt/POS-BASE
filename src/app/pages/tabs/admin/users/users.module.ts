import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsersPageRoutingModule } from './users-routing.module';

import { UsersPage } from './users.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { EditUserComponent, NewUserComponent, OptionUserComponent } from './components';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UsersPageRoutingModule,
    ComponentsModule,
    ReactiveFormsModule,
    PipesModule
  ],
  declarations: [
    UsersPage,
    EditUserComponent,  
    OptionUserComponent,
    NewUserComponent
  ]
})
export class UsersPageModule {}
