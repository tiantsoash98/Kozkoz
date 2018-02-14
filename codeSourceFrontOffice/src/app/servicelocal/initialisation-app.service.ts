import { Injectable } from '@angular/core';

import { PageParams } from '../models/pageParams.model';
import { ActiviteService } from '../services/activite.service';
import { ActualisationService } from '../services/actualisation.service';
import { SocketService } from '../services/socket.service';
import { Message } from '../models/message.model';
import { Utilisateur } from '../models/utilisateur.model';


@Injectable()
export class InitialisationAppService   {

  constructor(public activiteService: ActiviteService, public actualisationService: ActualisationService, public socketService: SocketService) { 
   
    this.initLastMessages();
    this.initActualisationMessagesSocket();
  }

  initLastMessages(){
    
    let msgs : Array<Message>;
    let shownUtilisateur : Utilisateur;

    console.log('stoorzelf,fdsv;'+localStorage.getItem('utilisateurLogin'));

    let utilisateurConnected : Utilisateur =JSON.parse(localStorage.getItem('utilisateurLogin'));
    let chats =JSON.parse(localStorage.getItem('chats'));
    
    //console.log(' usererrrrrrrrrrrrrrrrrrrrrrrr'+this.activiteService.connected.email);
    
    this.actualisationService.initLastMessagesService(utilisateurConnected)
    .then(list =>{    

      for(var i = 0; i < list.length; i++){
        msgs = new Array<Message>();
        msgs.push(list[i]);

        if(list[i].envoyeur.id == utilisateurConnected.id)
          shownUtilisateur = list[i].destinataire;
        else
          shownUtilisateur = list[i].envoyeur;

        this.actualisationService.chats.push({utilisateur: shownUtilisateur, messages: msgs, initialized: false, allow: true});    
        localStorage.setItem('chats',JSON.stringify(chats));
      }       
    });
  }


  initActualisationMessagesSocket(){
    let utilisateurConnected : Utilisateur =JSON.parse(localStorage.getItem('utilisateurLogin'));
    
    let socketService        = this.socketService;
    let actualisationService = this.actualisationService;
    let that                 = this;

    this.socketService.connect();
    this.socketService.stompClient.connect({}, function(frame){

      socketService.stompClient.subscribe('/listen/message/'+ utilisateurConnected.id, function (message) {
        actualisationService.pushChat(message.body, 1);

        let parse = JSON.parse(message.body);
        let toastContent = parse.envoyeur.prenom + ' ' + parse.envoyeur.nom + ' : ' + that.limitContent(parse.contenu);
        alert(toastContent) ;
      }); 


      socketService.stompClient.subscribe('/listen/bip/'+ utilisateurConnected.id, function (message) {
        let parse = JSON.parse(message.body);
        let toastContent = parse.envoyeur.prenom + ' ' + parse.envoyeur.nom + ' vous fait coucou!';
       alert(toastContent) ;
      }); 

      socketService.stompClient.subscribe('/listen/blocage/'+ utilisateurConnected.id, function (message) {
        let parse = JSON.parse(message.body);
        let index = actualisationService.getIndexUtilisateurInChats(parse.envoyeur.id);
        let toastContent = parse.envoyeur.prenom + ' ' + parse.envoyeur.nom;


        if(actualisationService.chats[index].allow){
          actualisationService.chats[index].allow = false;  
          toastContent += ' vous a bloque';
          alert(toastContent) ;
        }
        else{
          actualisationService.chats[index].allow = true;
          toastContent += ' vous a debloque';
          //that.presentToast(toastContent, 3000, 'bottom');
          alert(toastContent) ;
        }  
      }); 
    }); 
  }



  limitContent(text): string{
    let result : string = text;

    if(result.length > 30)
      result = result.substring(0, 30) + '...';
    
      return result;
  }


}
