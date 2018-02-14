import { Component, OnInit } from '@angular/core';

import { ActiviteService } from '../../services/activite.service';
import { Activite } from '../../models/activite.model';
import { PageParams } from '../../models/pageParams.model';
import { ChatComponent } from '../chat/chat.component';
import { SocketService } from '../../services/socket.service';
import { Utilisateur } from '../../models/utilisateur.model';
import { Localisation } from '../../models/localisation.model';


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
    window.location.href='chat/'+JSON.stringify(utilisateur);
}

bip(utilisateur: Utilisateur){
        this.socketService.bip(this.connected, utilisateur);
        alert('Vous avez fait coucou à ' + utilisateur.prenom + ' ' + utilisateur.nom);
}

  

}

  
