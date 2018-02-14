import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule }    from '@angular/http';
import { AgmCoreModule } from '@agm/core';
//import { StompService } from 'ng2-stomp-service';



import { AppComponent } from './app.component';
import { LoginComponent } from './page/login/login.component';
import { InscriptionComponent } from './page/inscription/inscription.component';
import { ExplorerComponent } from './page/explorer/explorer.component';
import { ChatComponent } from './page/chat/chat.component';
import { ProfilComponent } from './page/profil/profil.component';
import { HeaderComponent } from './pageimport/header/header.component';
import { FooterComponent } from './pageimport/footer/footer.component';
import { AppRoutingModule } from './/app-routing.module';

import { ActiviteService } from './services/activite.service';
import { ActualisationService } from './services/actualisation.service';
import { RecuperationService } from './services/recuperation.service';
import { SocketService } from './services/socket.service';
import { UtilisateurService } from './services/utilisateur.service';

import { InitialisationAppService } from './servicelocal/initialisation-app.service';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    InscriptionComponent,
    ExplorerComponent,
    ChatComponent,
    ProfilComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    AppRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyA0Dx_boXQiwvdz8sJHoYeZNVTdoWONYkU&amp'
    })
  ],
  providers: [
  //  StompService,
    ActiviteService,
    ActualisationService,
    RecuperationService,
    SocketService,
    UtilisateurService,
    InitialisationAppService
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
