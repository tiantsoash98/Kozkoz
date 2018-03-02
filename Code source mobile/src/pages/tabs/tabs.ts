import { Component } from '@angular/core';
import { ExplorerPage } from '../explorer/explorer';
import { ChatsPage } from '../chats/chats';
import { ProfilPage } from '../profil/profil';
import { PageParams } from '../../models/pageParams.model';
import { NavController } from 'ionic-angular/navigation/nav-controller';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { ActiviteService } from '../../services/activite.service';
import { ActualisationService } from '../../services/actualisation.service';

import { SocketService } from '../../services/socket.service';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { Message } from '../../models/message.model';
import { Utilisateur } from '../../models/utilisateur.model';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { Platform } from 'ionic-angular/platform/platform';
import { LoginPage } from '../login/login';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage extends PageParams{

    tab1Root = ExplorerPage;
    tab2Root = ChatsPage;
    tab3Root = ProfilPage;


    constructor(public platform: Platform, public navCtrl: NavController, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public toastCtrl: ToastController, public activiteService: ActiviteService, public actualisationService: ActualisationService, public socketService: SocketService) {    
      super(navCtrl, alertCtrl, activiteService);

      /*platform.pause.subscribe(() => {
        this.activiteService.disconnect(this.connected.email);
        this.socketService.disconnect();
        this.actualisationService.chats = new Array<{utilisateur: Utilisateur, messages: Array<Message>, initialized: boolean, allow: boolean}>();
        this.navCtrl.setRoot(LoginPage);
      }); */
            
      this.initListActifs();
      this.initLastMessages();
      this.initActualisationSocket();
      this.initEtat();
    }

    initListActifs(){
      let loading = this.loadingCtrl.create({
        content: 'Veuillez patienter...'
      });

      this.activiteService.getActifs(this.connected.email, this.activiteService.getCurrentPosition().lng, this.activiteService.getCurrentPosition().lat)
          .then(list =>{
              loading.dismiss();
              this.activiteService.listActif = list;
          });  
    }

    initLastMessages(){
      let loading = this.loadingCtrl.create({
          content: 'Veuillez patienter...'
      });

      loading.present();
      let msgs : Array<Message>;
      let shownUtilisateur : Utilisateur;

      this.actualisationService.initLastMessagesService(this.activiteService.connected)
      .then(list =>{    
        loading.dismiss();

        for(var i = 0; i < list.length; i++){
          msgs = new Array<Message>();
          msgs.push(list[i]);

          if(list[i].envoyeur.id == this.activiteService.connected.id)
            shownUtilisateur = list[i].destinataire;
          else
            shownUtilisateur = list[i].envoyeur;

          this.actualisationService.chats.push({utilisateur: shownUtilisateur, messages: msgs, initialized: false, allow: true});    
        }       
      });
    }

    initActualisationSocket(){
      let socketService = this.socketService;
      let activiteService = this.activiteService;
      let actualisationService = this.actualisationService;
      let that = this;

      this.socketService.stompClient.connect({}, function(frame){

        socketService.stompClient.subscribe('/listen/message/'+ activiteService.getConnected().id, function (message) {
          actualisationService.pushChat(message.body, 1);

          let parse = JSON.parse(message.body);
          let toastContent = parse.envoyeur.prenom + ' ' + parse.envoyeur.nom + ' : ' + that.limitContent(parse.contenu);
          that.presentToast(toastContent, 3000, 'top');
        }); 


        socketService.stompClient.subscribe('/listen/bip/'+ activiteService.getConnected().id, function (message) {
          let parse = JSON.parse(message.body);
          let toastContent = parse.envoyeur.prenom + ' ' + parse.envoyeur.nom + ' vous fait coucou!';
          that.presentToast(toastContent, 3000, 'top');
        }); 

        socketService.stompClient.subscribe('/listen/blocage/'+ activiteService.getConnected().id, function (message) {
          let parse = JSON.parse(message.body);
          let index = actualisationService.getIndexUtilisateurInChats(parse.envoyeur.id);
          
          let toastContent = parse.envoyeur.prenom + ' ' + parse.envoyeur.nom;


          if(actualisationService.chats[index].allow){
            actualisationService.chats[index].allow = false;  
            toastContent += ' vous a bloqué';
            that.presentToast(toastContent, 3000, 'bottom');

            activiteService.listBloc.push(parse.envoyeur);
          }
          else{
            actualisationService.chats[index].allow = true;
            toastContent += ' vous a debloqué';
            that.presentToast(toastContent, 3000, 'bottom');

            let indexBloc = activiteService.getIndexUtilisateurInBlocage(parse.envoyeur.id);
            activiteService.listBloc.splice(indexBloc, 1);
          }  
        }); 

        socketService.stompClient.subscribe('/listen/statut/', function (activite) {
          console.log('ici');
          let parse = JSON.parse(activite.body);
          var index = activiteService.getIndexUtilisateurInActifs(parse.utilisateur.id);
          if(index != -1){
            activiteService.listActif[index] = parse;
          }
        }); 
      }, function(error){
          that.alertCtrl.create({
            title: 'Erreur',
            message: 'Impossible de se connecter aux serveurs',
            buttons: ['OK']
        }).present();

        this.activiteService.disconnect(this.connected.email);
        this.actualisationService.chats = new Array<{utilisateur: Utilisateur, messages: Array<Message>, initialized: boolean, allow: boolean}>();
        this.activiteService.listBloc = new Array<Utilisateur>();
        this.activiteService.statut = '';
        that.navCtrl.setRoot(LoginPage);       
      }); 
    }

    initEtat(){
      this.activiteService.getEtat(this.connected)
        .then(activite => {
          if(activite != null){
            this.activiteService.statut = activite.statut;
            this.activiteService.etat = activite.etat;
          }        
        });
    }

    presentToast(message, duration, position){
      let toast = this.toastCtrl.create({
        message: message,
        duration: duration,
        position: position
      });

      toast.present();
    }

    limitContent(text): string{
      let result : string = text;

      if(result.length > 30)
        result = result.substring(0, 30) + '...';
      
        return result;
    }
}
