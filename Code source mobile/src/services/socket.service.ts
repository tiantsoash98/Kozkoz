import { Injectable }   from '@angular/core';
import Stomp from 'stompjs';
import SockJS from 'sockjs-client';

import { WebServiceParams } from '../models/webServiceParams.model';
import { Utilisateur } from '../models/utilisateur.model';
import { Localisation } from '../models/localisation.model';

@Injectable()
export class SocketService extends WebServiceParams{
    public stompClient;

    constructor(){
        super();
    }

    connect(){
        let ws = new SockJS(this.socketUrl);
        this.stompClient = Stomp.over(ws); 
    }

    disconnect(){
        if(this.stompClient !== null){
            this.stompClient.disconnect();
        }
    }

    bip(connected: Utilisateur, utilisateur: Utilisateur){  
        let date = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate() + ' ' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds();
        let toSend = '{"envoyeur":{"id":"'+connected.id+'", "nom":"'+connected.nom+'", "prenom":"'+connected.prenom+'", "naissance":"'+connected.naissance+'", "sexe":"'+connected.sexe+'", "email":"'+connected.email+'", "photo":"'+connected.photo+'"}, "destinataire":{"id":"'+utilisateur.id+'", "nom":"'+utilisateur.nom+'", "prenom":"'+utilisateur.prenom+'", "naissance":"'+utilisateur.naissance+'", "sexe":"'+utilisateur.sexe+'", "email":"'+utilisateur.email+'", "photo":"'+utilisateur.photo+'"}, "date":"'+date+'", "type":10}';
        this.stompClient.send("/app/send/bip", {}, toSend);
    }

    bloquer(connected: Utilisateur, utilisateur: Utilisateur){  
        let date = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate() + ' ' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds();
        let toSend = '{"envoyeur":{"id":"'+connected.id+'", "nom":"'+connected.nom+'", "prenom":"'+connected.prenom+'", "naissance":"'+connected.naissance+'", "sexe":"'+connected.sexe+'", "email":"'+connected.email+'", "photo":"'+connected.photo+'"}, "destinataire":{"id":"'+utilisateur.id+'", "nom":"'+utilisateur.nom+'", "prenom":"'+utilisateur.prenom+'", "naissance":"'+utilisateur.naissance+'", "sexe":"'+utilisateur.sexe+'", "email":"'+utilisateur.email+'", "photo":"'+utilisateur.photo+'"}, "date":"'+date+'", "type":10}';
        this.stompClient.send("/app/send/blocage", {}, toSend);
    }

    updateStatut(connected: Utilisateur, localisation: Localisation, etat: number, statut: string){  
        let toSend = '{"utilisateur":{"id":"'+connected.id+'", "nom":"'+connected.nom+'", "prenom":"'+connected.prenom+'", "naissance":"'+connected.naissance+'", "sexe":"'+connected.sexe+'", "email":"'+connected.email+'", "photo":"'+connected.photo+'"}, "localisation":{"lng": '+localisation.lng+', "lat": '+localisation.lat+'}, "etat": '+etat+', "statut": "'+ statut+'"}';
        this.stompClient.send("/app/update/statut", {}, toSend);
    }
}