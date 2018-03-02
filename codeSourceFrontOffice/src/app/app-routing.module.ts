import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './page/login/login.component';
import { InscriptionComponent } from './page/inscription/inscription.component';
import { ExplorerComponent } from './page/explorer/explorer.component';
import { ChatComponent } from './page/chat/chat.component';
import { ProfilComponent } from './page/profil/profil.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'inscription', component: InscriptionComponent },
  { path: 'explorer', component: ExplorerComponent },
  { path: 'chat/', component: ChatComponent },
  { path: 'chat/:utilisateur', component: ChatComponent },
  { path: 'profil', component: ProfilComponent }
];
@NgModule({

  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes) ],
  /*imports: [
    CommonModule
  ],
  */
  declarations: []
})
export class AppRoutingModule { }
