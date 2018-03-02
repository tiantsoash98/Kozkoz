import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { ActiviteService } from '../services/activite.service';
import { SocketService } from '../services/socket.service';
import { ActualisationService } from '../services/actualisation.service';
import { UtilisateurService } from '../services/utilisateur.service';
import { RecuperationService } from '../services/recuperation.service';

import { ProfilPage } from '../pages/profil/profil';
import { ChatPage } from '../pages/chat/chat';
import { MapPage } from '../pages/map/map';
import { ChatsPage } from '../pages/chats/chats';
import { ExplorerPage } from '../pages/explorer/explorer';
import { ReinitialisationPage } from '../pages/reinitialisation/reinitialisation';
import { CodePage } from '../pages/code/code';
import { RecuperationPage } from '../pages/recuperation/recuperation';
import { InscriptionPage } from '../pages/inscription/inscription';
import { LoginPage } from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Geolocation } from '@ionic-native/geolocation';


import { HttpModule } from '@angular/http';




@NgModule({
  declarations: [
    MyApp,
    ProfilPage,
    ChatsPage,
    MapPage,
    ExplorerPage,
    LoginPage,  
    InscriptionPage,
    RecuperationPage,
    CodePage,
    ReinitialisationPage,
    ChatPage,
    TabsPage   
  ],
  imports: [
    HttpModule,
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ProfilPage,
    ChatsPage,
    MapPage,
    ExplorerPage,
    LoginPage,
    InscriptionPage,
    RecuperationPage,
    CodePage,
    ReinitialisationPage,
    ChatPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    UtilisateurService,
    RecuperationService,
    ActiviteService,
    SocketService,
    ActualisationService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
