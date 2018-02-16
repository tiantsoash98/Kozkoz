import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { Utilisateur } from '../../models/utilisateur.model';
import { SocketService } from '../../services/socket.service';
import { ActiviteService } from '../../services/activite.service';
import { ActualisationService } from '../../services/actualisation.service';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';

import { PageParams } from '../../models/pageParams.model';
import { Message } from '../../models/message.model';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { ActionSheetController } from 'ionic-angular/components/action-sheet/action-sheet-controller';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { Activite } from '../../models/activite.model';

@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html'
})

export class ChatPage extends PageParams{
    @ViewChild('content') content:any;

    utilisateur: Utilisateur;
    allow: boolean;
    message: any  = {};
    messages: Array<Message>;
    text: string;
    activite: Activite;

    constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public toastCtrl: ToastController, public actionSheetCtrl: ActionSheetController, public activiteService: ActiviteService, private socketService: SocketService, private actualisationService: ActualisationService) {
        super(navCtrl, alertCtrl, activiteService);

        this.utilisateur = this.navParams.get('utilisateur');   
        this.activite = new Activite(); 

        this.initMessages();        
        this.initActivite(); 
    }

    ionViewDidEnter(){
        this.content.scrollToBottom(300);//300ms animation speed

        setTimeout(() => {
            this.content.scrollToBottom(300);//300ms animation speed
        }, 10);
    }

    initMessages(){
        var index = this.actualisationService.getIndexUtilisateurInChats(this.utilisateur.id);

        if(index == -1 || (index != -1 && !this.actualisationService.chats[index].initialized)){
            let loading = this.loadingCtrl.create({
                content: 'Veuillez patienter...'
            });
    
            loading.present();

            this.actualisationService.initMessagesPartenaireService(this.connected, this.utilisateur)
            .then(list =>{
                loading.dismiss();

                if(index == -1){
                    this.actualisationService.chats.push({utilisateur: this.utilisateur, messages: list, initialized: true, allow: true});
                    this.messages = this.actualisationService.chats[this.actualisationService.getIndexUtilisateurInChats(this.utilisateur.id)].messages; 
                    this.text = 'Bloquer';
                }
                else if(index != -1 && !this.actualisationService.chats[index].initialized){
                    this.actualisationService.chats[index].messages = list;
                    this.actualisationService.chats[index].initialized = true;
                    this.messages = this.actualisationService.chats[index].messages;
                    this.text = this.actualisationService.chats[index].allow ? 'Bloquer' : 'Debloquer';
                }          
            });
        }
        else if(index != -1 && this.actualisationService.chats[index].initialized){
            this.messages = this.actualisationService.chats[index].messages; 
            this.text = this.actualisationService.chats[index].allow ? 'Bloquer' : 'Debloquer';
        }  
    }

    initActivite(){
        this.activiteService.getEtat(this.utilisateur)
            .then(activite => {
                if(activite != null && activite.statut != '')
                    this.activite = activite;
            });
    }

    send(){  
        var index = this.actualisationService.getIndexUtilisateurInChats(this.utilisateur.id);

        if(this.actualisationService.chats[index].allow){
            if(this.message.contenu != null && this.message.contenu != ''){
                let content = this.message.contenu;
                let date = new Date().getFullYear() + '-' + this.formatTime((new Date().getMonth() + 1)) + '-' + this.formatTime(new Date().getDate()) + ' ' + this.formatTime(new Date().getHours()) + ':' + this.formatTime(new Date().getMinutes()) + ':' + this.formatTime(new Date().getSeconds());
    
                let toSend = '{"contenu":"'+content+'", "envoyeur":{"id":"'+this.connected.id+'", "nom":"'+this.connected.nom+'", "prenom":"'+this.connected.prenom+'", "naissance":"'+this.connected.naissance+'", "sexe":"'+this.connected.sexe+'", "email":"'+this.connected.email+'", "photo":"'+this.connected.photo+'"}, "destinataire":{"id":"'+this.utilisateur.id+'", "nom":"'+this.utilisateur.nom+'", "prenom":"'+this.utilisateur.prenom+'", "naissance":"'+this.utilisateur.naissance+'", "sexe":"'+this.utilisateur.sexe+'", "email":"'+this.utilisateur.email+'", "photo":"'+this.utilisateur.photo+'"}, "date":"'+date+'", "type":10}';
    
                this.socketService.stompClient.send("/app/send/message", {}, toSend);
                this.actualisationService.pushChat(toSend, 0);
                
                this.message.contenu = "";
            } 
        }
        else{
            let toast = this.toastCtrl.create({
                message: 'Le message n\a pas ete envoye car ' + this.utilisateur.prenom + ' vous a bloqué',
                duration: 3000,
                position: 'bottom'
            });
    
            toast.present();
        }
    }

    actions(){
        let actionSheet = this.actionSheetCtrl.create({
          buttons: [
            {
                text: 'Faire coucou',
                icon: 'ios-hand-outline',
                handler: () => {
                    this.socketService.bip(this.connected, this.utilisateur);
                }
            },
            {
                text: this.text,
                icon: 'ios-close-circle-outline',
                handler: () => {
                    this.socketService.bloquer(this.connected, this.utilisateur);

                    if(this.text == 'Bloquer')
                        this.text = 'Debloquer';
                    else
                        this.text = 'Bloquer';
                }
            },
            {
              text: 'Annuler',
              role: 'cancel',
              icon: 'close',
              handler: () => {
                
              }
            }
          ]
        });
    
        actionSheet.present();
    }

    formatTime(time: number): string{
        let toString = String(time);

        if(toString.length == 1)
            return '0' + toString;

        return toString;
    }

   
}
