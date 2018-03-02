import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ActiviteService } from '../../services/activite.service';
import { PageParams } from '../../models/pageParams.model';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { ChatPage } from '../chat/chat';
import { ActionSheetController } from 'ionic-angular/components/action-sheet/action-sheet-controller';
import { SocketService } from '../../services/socket.service';
import { MapPage } from '../map/map';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { Utilisateur } from '../../models/utilisateur.model';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';

@Component({
  selector: 'page-explorer',
  templateUrl: 'explorer.html'
})
export class ExplorerPage extends PageParams{

    constructor(public navCtrl: NavController, public alertCtrl: AlertController, public actionSheetCtrl: ActionSheetController, public modalCtrl: ModalController, public loadingCtrl: LoadingController, public toastCtrl: ToastController, public activiteService: ActiviteService, public socketService: SocketService) {
        super(navCtrl, alertCtrl, activiteService);
    }

    swipeEvent(e){
        switch(e.direction){  
          case 2:
            this.navCtrl.parent.select(1);
            break;
        }
    }

    doRefresh(refresher) {
        this.activiteService.getActifs(this.connected.email, this.activiteService.getCurrentPosition().lng, this.activiteService.getCurrentPosition().lat)
            .then(list =>{
                refresher.complete();
                this.activiteService.listActif = list;
            });
    }

    message(utilisateur){
        this.navCtrl.push(ChatPage, {utilisateur: utilisateur});
    }

    actions(utilisateur: Utilisateur){
        let indexBloc = this.activiteService.getIndexUtilisateurInBlocage(utilisateur.id);
        let textBloc : string;

        if(indexBloc == -1)
            textBloc = 'Bloquer';
        else
            textBloc = 'Débloquer';
            
        let actionSheet = this.actionSheetCtrl.create({
          title: utilisateur.prenom + ' ' + utilisateur.nom,
          buttons: [
            {
                text: 'Discuter',
                icon: 'ios-chatbubbles-outline',
                handler: () => {
                    this.navCtrl.push(ChatPage, {utilisateur: utilisateur});
                }
            },
            {
                text: 'Faire coucou',
                icon: 'ios-hand-outline',
                handler: () => {
                    this.bip(utilisateur);
                }
            },
            {
                text: 'Bloquer / Débloquer',
                icon: 'ios-close-circle-outline',
                handler: () => {
                    this.socketService.bloquer(this.connected, utilisateur);

                    let toast = this.toastCtrl.create({
                        message: 'Vous avez ' + (indexBloc == -1 ? 'bloqué' : 'débloqué') + ' ' + utilisateur.prenom,
                        duration: 3000,
                        position: 'bottom'
                    });
            
                    toast.present();
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

    bip(utilisateur: Utilisateur){
        let indexBloc = this.activiteService.getIndexUtilisateurInBlocage(utilisateur.id);

        if(indexBloc == -1){
            this.socketService.bip(this.connected, utilisateur);

            let toast = this.toastCtrl.create({
                message: 'Vous avez fait coucou à ' + utilisateur.prenom + ' ' + utilisateur.nom,
                duration: 3000,
                position: 'bottom'
            });
        
            toast.present();
        }
        else{
            let toast = this.toastCtrl.create({
                message: utilisateur.prenom + ' vous a bloqué',
                duration: 3000,
                position: 'bottom'
            });
    
            toast.present();
        }
    }


    map(){
        this.modalCtrl.create(MapPage).present();
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
}
