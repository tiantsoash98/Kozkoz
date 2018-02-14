import { Component, OnInit } from '@angular/core';


import { ActiviteService } from '../../services/activite.service';
import { Utilisateur } from '../../models/utilisateur.model';
import { SocketService } from '../../services/socket.service';
import { ActualisationService } from '../../services/actualisation.service';
import { Message } from '../../models/message.model';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private activiteService: ActiviteService, public actualisationService: ActualisationService, private socketService: SocketService) { 
    this.connected = this.activiteService.getConnected();
  }

  ngOnInit() {
  }

  connected: Utilisateur;

  disconnect(){
    this.activiteService.disconnect(this.connected.email);
    this.socketService.disconnect();
    this.actualisationService.chats = new Array<{utilisateur: Utilisateur, messages: Array<Message>, initialized: boolean, allow: boolean}>();
    window.location.href='login';

    this.activiteService.disconnect(this.connected.email);
    this.socketService.disconnect();
    localStorage.clear();
    this.actualisationService.chats = new Array<{utilisateur: Utilisateur, messages: Array<Message>, initialized: boolean, allow: boolean}>();
    window.location.href='login';
  }
}


