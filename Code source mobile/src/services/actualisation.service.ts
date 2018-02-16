import { Injectable }   from '@angular/core';
import { Http }         from '@angular/http';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

import { WebServiceParams } from '../models/webServiceParams.model';
import { Message } from '../models/message.model';
import { Utilisateur } from "../models/utilisateur.model";


@Injectable()
export class ActualisationService extends WebServiceParams{
    chats: Array<{utilisateur: Utilisateur, messages: Array<Message>, initialized: boolean, allow: boolean}>;

    constructor(private http: Http){
        super();

        this.chats = new Array<{utilisateur: Utilisateur, messages: Array<Message>, initialized: false, allow: true}>();
    }

    pushChat(chat, source: number){ // source: 0 envoyeur, 1 destinataire
        let parse = JSON.parse(chat);

        var index = this.getIndexUtilisateurInChats(source == 0 ? parse.destinataire.id : parse.envoyeur.id);

        let utilisateur = new Utilisateur(parse.envoyeur.id, parse.envoyeur.nom, parse.envoyeur.prenom, parse.envoyeur.naissance, parse.envoyeur.sexe, parse.envoyeur.email, parse.envoyeur.photo);
        let destinataire = new Utilisateur(parse.destinataire.id, parse.destinataire.nom, parse.destinataire.prenom, parse.destinataire.naissance, parse.destinataire.sexe , parse.destinataire.email, parse.destinataire.photo);

        if(index == -1){           
            let msgs = new Array<Message>();
            msgs.push(new Message(parse.contenu, utilisateur, destinataire, parse.date, parse.type));

            if(source == 0)
                this.chats.push({utilisateur: destinataire, messages: msgs, initialized: true, allow: true});

            else
                this.chats.push({utilisateur: utilisateur, messages: msgs, initialized: true, allow: true});

        }
        else{
            this.chats[index].messages.push(new Message(parse.contenu, utilisateur, destinataire, parse.date, parse.type));
        }
    }

    getIndexUtilisateurInChats(id){
        for(var i = 0; i < this.chats.length; i++){
            if(this.chats[i].utilisateur.id == id)
                return i;
        }

        return -1;
    }


    public initMessagesPartenaireService(connected: Utilisateur, partenaire: Utilisateur): Promise<any>{
        const url = this.serverUrl + '/init-messages-utilisateur?utilisateur='+connected.email+'&partenaire='+partenaire.email;
  
        return this.http.get(url)
        .toPromise()
        .then(response => response.json() as Array<Message>)
        .catch(error => console.log('Une erreur est survenue ' + error))  
    }

    public initLastMessagesService(connected: Utilisateur): Promise<any>{
        const url = this.serverUrl + '/init-messages?utilisateur='+connected.email;
  
        return this.http.get(url)
        .toPromise()
        .then(response => response.json() as Array<Message>)
        .catch(error => console.log('Une erreur est survenue ' + error))  
    }
}