import { Component, OnInit } from '@angular/core';

import { UtilisateurService } from '../../services/utilisateur.service';
import { ActiviteService } from '../../services/activite.service';
import { ActualisationService } from '../../services/actualisation.service';
import { SocketService } from '../../services/socket.service';

import { InitialisationAppService } from '../../servicelocal/initialisation-app.service';

import { Utilisateur } from '../../models/utilisateur.model';
import { Localisation } from '../../models/localisation.model';
import { Message } from '../../models/message.model';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent   {
  loginData: any = {};
  
  constructor( private utilisateurService: UtilisateurService, private activiteService: ActiviteService, private actualisationService : ActualisationService, private socketService: SocketService, public initialisationAppService : InitialisationAppService) { 
    if(localStorage.getItem('utilisateurLogin')!=null){
        window.location.href='explorer';

    }
  }

  ngOnInit() {
      console.log("recharge");
  }
    

  login() {/* console.log("test loop infinite");
  
    }*/  
    this.utilisateurService.verificationLogin(this.loginData.email, this.loginData.password)
    .then(utilisateurFetched =>{
        
        if(utilisateurFetched.status == '0'){
            alert( 'Verifiez l\'email ou le mot de passe');
           
        }
        else if(utilisateurFetched.status == '1'){
            alert( 'Mot de passe incorrect');
        }
        else if(utilisateurFetched.status == '2'){
            this.activiteService.setConnected(utilisateurFetched.utilisateur);
            localStorage.setItem('utilisateurLogin',JSON.stringify(utilisateurFetched.utilisateur));
          
            let chats: Array<{utilisateur: Utilisateur, messages: Array<Message>, initialized: boolean, allow: boolean}>;
           chats = new Array<{utilisateur: Utilisateur, messages: Array<Message>, initialized: false, allow: true}>();
           
          localStorage.setItem('chats',JSON.stringify(chats));

                if(navigator.geolocation){
                  navigator.geolocation.getCurrentPosition(position => {
                      this.activiteService.connect(utilisateurFetched.utilisateur.email, position.coords.longitude, position.coords.latitude, 20)
                      .then(response =>{
                          localStorage.setItem('currentPosition',JSON.stringify(new Localisation(position.coords.longitude, position.coords.latitude)));
                          this. initialisationAppService .initLastMessages();
                          window.location.href='explorer';
                      });
                  });
               }
               else{
                  alert('Geolocation :Impossible d\'obtenir la position géographique');
                  
               }
        }
    });
  }
  
}
