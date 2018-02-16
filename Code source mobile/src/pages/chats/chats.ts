import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ActualisationService } from '../../services/actualisation.service';
import { ChatPage } from '../chat/chat';
import { ActionSheetController } from 'ionic-angular/components/action-sheet/action-sheet-controller';
import { PageParams } from '../../models/pageParams.model';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { ActiviteService } from '../../services/activite.service';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'page-chats',
  templateUrl: 'chats.html'
})
export class ChatsPage extends PageParams{

  constructor(public navCtrl: NavController, public actionSheetCtrl: ActionSheetController, public alertCtrl: AlertController, public activiteService: ActiviteService, private actualisationService: ActualisationService, public socketService: SocketService) {
    super(navCtrl, alertCtrl, activiteService);
  }
  
  swipeEvent(e){
    switch(e.direction){  
        case 2:
            this.navCtrl.parent.select(2);
            break;

        case 4:
            this.navCtrl.parent.select(0);
            break;
    }
}

  message(chat){
    this.navCtrl.push(ChatPage, {utilisateur: chat.utilisateur});
  }

  actions(utilisateur){
    let actionSheet = this.actionSheetCtrl.create({
      title: utilisateur.prenom + ' ' + utilisateur.nom,
      buttons: [
        {
          text: 'Supprimer',
          icon: 'md-trash',
          handler: () => {
            console.log('Supprimé!');
          }
        },
        {
          text: 'Annuler',
          role: 'cancel',
          icon: 'close',
          handler: () => {}
        }
      ]
    });

    actionSheet.present();
  }

  bloquer(utilisateur){
    this.socketService.bloquer(this.connected, utilisateur);
  }
}
