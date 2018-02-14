import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';


import { Utilisateur } from '../../models/utilisateur.model';
import { PageParams } from '../../models/pageParams.model';
import { Message } from '../../models/message.model';

import { SocketService } from '../../services/socket.service';
import { ActiviteService } from '../../services/activite.service';
import { ActualisationService } from '../../services/actualisation.service';
import { UtilisateurService } from '../../services/utilisateur.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent  extends PageParams implements OnInit {

  @ViewChild('content') content:any;

  utilisateur: Utilisateur;
  chatWith: Utilisateur;
  allow: boolean;
  message: any  = {};
  messages: Array<Message>;
  text: string;
  chats : any;

  constructor(private route: ActivatedRoute, private location: Location, public activiteService: ActiviteService, private socketService: SocketService, private actualisationService: ActualisationService) { 
    super();  

    var parsedJSON;
    if(this.route.snapshot.paramMap.get('utilisateur') != null){
          parsedJSON       = JSON.parse(this.route.snapshot.paramMap.get('utilisateur'));
          this.utilisateur = parsedJSON as Utilisateur;
          this.initMessages();
    }
    this. chats =JSON.parse(localStorage.getItem('chats'));
    this.initMessages();
    //const employeeObj: Employee = parsedJSON as Employee;
    
    
    
  }

  ngOnInit() {
  }

  ionViewDidEnter(){
    this.content.scrollToBottom(300);//300ms animation speed

    setTimeout(() => {
        this.content.scrollToBottom(300);//300ms animation speed
    }, 10);
  }

    toMessage(utilisateur){
        this.chatWith=utilisateur;
        window.location.href='chat/'+JSON.stringify(utilisateur);
    }
    chatWithSelected(){
        this.initMessages();

    }  
    initMessages(){
        var index = this.actualisationService.getIndexUtilisateurInChats(this.utilisateur.id);

        if(index == -1 || (index != -1 && !this.actualisationService.chats[index].initialized)){
            


            this.actualisationService.initMessagesPartenaireService(this.connected, this.utilisateur)
            .then(list =>{

                if(index == -1){
                    this.actualisationService.chats.push({utilisateur: this.utilisateur, messages: list, initialized: true, allow: true});
                    var indice      =this.actualisationService.chats.length-1;
                    this.messages   = this.actualisationService.chats[this.actualisationService.getIndexUtilisateurInChats(this.utilisateur.id)].messages; 
                    this.text = this.actualisationService.chats[indice].allow ? 'Bloquer' : 'Debloquer';

                    localStorage.setItem('chats',JSON.stringify(this.actualisationService.chats));
                }
                else if(index != -1 && !this.actualisationService.chats[index].initialized){
                    this.actualisationService.chats[index].messages = list;
                    this.actualisationService.chats[index].initialized = true;
                    this.messages = this.actualisationService.chats[index].messages;
                    this.text = this.actualisationService.chats[index].allow ? 'Bloquer' : 'Debloquer';

                    localStorage.setItem('chats',JSON.stringify(this.actualisationService.chats));
                    
                }          
            });
        }
        else if(index != -1 && this.actualisationService.chats[index].initialized){
            this.messages = this.actualisationService.chats[index].messages; 
            this.text = this.actualisationService.chats[index].allow ? 'Bloquer' : 'Debloquer';

        }  
        console.log(' chat about '+index+' '+this.actualisationService.chats);
        console.log(' chat length '+index+' '+this.actualisationService.chats.length);
        
        }

    send(){  
        var index = this.actualisationService.getIndexUtilisateurInChats(this.utilisateur.id);

        if(this.actualisationService.chats[index].allow){
            if(this.message.contenu != null && this.message.contenu != ''){
                let content = this.message.contenu;
                let date = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate() + ' ' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds();

                let toSend = '{"contenu":"'+content+'", "envoyeur":{"id":"'+this.connected.id+'", "nom":"'+this.connected.nom+'", "prenom":"'+this.connected.prenom+'", "naissance":"'+this.connected.naissance+'", "sexe":"'+this.connected.sexe+'", "email":"'+this.connected.email+'", "photo":"'+this.connected.photo+'"}, "destinataire":{"id":"'+this.utilisateur.id+'", "nom":"'+this.utilisateur.nom+'", "prenom":"'+this.utilisateur.prenom+'", "naissance":"'+this.utilisateur.naissance+'", "sexe":"'+this.utilisateur.sexe+'", "email":"'+this.utilisateur.email+'", "photo":"'+this.utilisateur.photo+'"}, "date":"'+date+'", "type":10}';

                this.socketService.connect();
                this.socketService.stompClient.send("/app/send/message", {}, toSend);
                this.actualisationService.pushChat(toSend, 0);
                
                this.message.contenu = "";
            } 
        }
        else{
            
            alert('Le message n\a pas ete envoye car ' + this.utilisateur.prenom + ' vous a bloque');
        }
    }

    coucou(){
        this.socketService.bip(this.connected, this.utilisateur);
    }

    bloquer(){
        this.socketService.bloquer(this.connected, this.utilisateur);
        
                        if(this.text == 'Bloquer')
                            this.text = 'Debloquer';
                        else
                            this.text = 'Bloquer';
                    
    }



}
