import { Component, OnInit } from '@angular/core';

import { ActiviteService } from '../../services/activite.service';
import { Activite } from '../../models/activite.model';
import { PageParams } from '../../models/pageParams.model';
import { ChatComponent } from '../chat/chat.component';
import { SocketService } from '../../services/socket.service';
import { Utilisateur } from '../../models/utilisateur.model';
import { Localisation } from '../../models/localisation.model';

//import { MapPage } from '../map/map';

@Component({
  selector: 'app-explorer',
  templateUrl: './explorer.component.html',
  styleUrls: ['./explorer.component.css']
})
export class ExplorerComponent extends PageParams implements OnInit {
  listActif: Array<Activite>;
  centrerLocalisation =this.activiteService.getCurrentPosition();
  
  constructor(public activiteService: ActiviteService, public socketService: SocketService) { 
    super();
    this.initListActifs(); 
  }

  //
  ngOnInit() {
  }
  
  initListActifs(){
   this.activiteService.getActifs(this.connected.email,  this.activiteService.getCurrentPosition().lng, this.activiteService.getCurrentPosition().lat)
        .then(list =>{
            this.listActif = list;
        });  
}

message(utilisateur){
    window.location.href='chat/'+utilisateur.id;
}

bip(utilisateur: Utilisateur){
        this.socketService.bip(this.connected, utilisateur);
        alert('Vous avez fait coucou à ' + utilisateur.prenom + ' ' + utilisateur.nom);
}

/*actions(utilisateur){
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
                this.socketService.bip(this.connected, utilisateur);
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
*/
/*
map(){
    this.modalCtrl.create(MapPage).present();
}
*/
  

}

  
