import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ActiviteService } from '../../services/activite.service';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { LoginPage } from '../login/login';
import { Utilisateur } from '../../models/utilisateur.model';
import { SocketService } from '../../services/socket.service';
import { ActualisationService } from '../../services/actualisation.service';
import { Message } from '../../models/message.model';
import { PageParams } from '../../models/pageParams.model';

@Component({
  selector: 'page-profil',
  templateUrl: 'profil.html'
})
export class ProfilPage extends PageParams{

    constructor(public navCtrl: NavController, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public activiteService: ActiviteService, public actualisationService: ActualisationService, private socketService: SocketService) {
       super(navCtrl, alertCtrl, activiteService);
    }

    
    swipeEvent(e){
        switch(e.direction){  
            case 4:
                this.navCtrl.parent.select(1);
                break;
        }
    }


    disconnect(){
        this.activiteService.disconnect(this.connected.email);
        this.socketService.disconnect();
        this.actualisationService.chats = new Array<{utilisateur: Utilisateur, messages: Array<Message>, initialized: boolean, allow: boolean}>();
        this.activiteService.listBloc = new Array<Utilisateur>();
        this.activiteService.statut = '';
        this.navCtrl.setRoot(LoginPage);
    }


    statut(){
        let prompt = this.alertCtrl.create({
            title: 'Status',
            message: 'Comment vous-sentez vous?',
            inputs: [
                {
                    name: 'statut',
                    placeholder: 'Statut',
                    value: this.activiteService.statut,
                    max: 150
                }             
            ],
            buttons: [
                {
                    text: 'Cancel',
                    handler: data => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Save',
                    handler: data => {
                        this.activiteService.statut = data.statut;
                        this.socketService.updateStatut(this.connected, this.activiteService.currentPosition, this.activiteService.etat, data.statut);    
                    }
                }
            ]
        });

        prompt.present();
    }
}
