import { Injectable }   from '@angular/core';
import { Http }         from '@angular/http';

import { WebServiceParams } from '../models/webServiceParams.model';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { Utilisateur } from '../models/utilisateur.model';
import { Activite } from '../models/activite.model';
import { Localisation } from '../models/localisation.model';
import { Geolocation } from '@ionic-native/geolocation';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';


@Injectable()
export class ActiviteService extends WebServiceParams{
    public connected: Utilisateur;
    public currentPosition: Localisation;
    public etat: number;
    public statut: string;

    public listActif: Array<Activite>;
    public listBloc: Array<Utilisateur>;

    constructor(private alertCtrl: AlertController, private http: Http, private geolocation: Geolocation) {
        super();

        this.listActif = new Array<Activite>();
        this.listBloc = new Array<Utilisateur>();
    }

    setConnected(utilisateur: Utilisateur){
        this.connected = utilisateur;
    }

    getConnected(){
        return this.connected;
    }

    setCurrentPosition(position: Localisation){
        this.currentPosition = position;
    }

    getCurrentPosition(){
        return this.currentPosition;
    }

    public connect(email, lng, lat, etat){
        const url = this.serverUrl + '/connect?email='+email+'&lng='+lng+'&lat='+lat+'&etat='+etat;
  
        return this.http.get(url)
        .toPromise()
        .then(response => response.json())
        .catch(error => console.log('Une erreur est survenue ' + error))  
    }

    public disconnect(email){
        const url = this.serverUrl + '/disconnect?email='+email;

        return this.http.get(url)
        .toPromise()
        .then(response => response.json())
        .catch(error => console.log('Une erreur est survenue ' + error))  
    }

    public getActifs(email, lng, lat): Promise<any>{
        const url = this.serverUrl + '/list-actifs?email='+email+'&lng='+lng+'&lat='+lat;

        return this.http.get(url)
        .toPromise()
        .then(response => response.json() as Array<Activite>)
        .catch(error => console.log('Une erreur est survenue ' + error))  
    }

    public getEtat(utilisateur: Utilisateur): Promise<any>{
        const url = this.serverUrl + '/activite?email='+utilisateur.email;

        return this.http.get(url)
        .toPromise()
        .then(response => response.json() as Activite)
        .catch(error => console.log('Une erreur est survenue ' + error))  
    }

    public updateCurrentPosition(){
        this.geolocation.getCurrentPosition()
            .then((position) => {      

                this.currentPosition.lng = position.coords.longitude;
                this.currentPosition.lat = position.coords.latitude;

            }).catch((error) => {
                this.alertCtrl.create({
                    title: 'Geolocation',
                    message: 'Impossible d\'obtenir la position géographique',
                    buttons: ['OK']
                }).present();
            })
    }

    getIndexUtilisateurInActifs(id: string){
        for(var i = 0; i < this.listActif.length; i++){
            if(this.listActif[i].utilisateur.id == id)
                return i;
        }

        return -1;
    }

    getIndexUtilisateurInBlocage(id: string){
        for(var i = 0; i < this.listBloc.length; i++){
            if(this.listBloc[i].id == id)
                return i;
        }

        return -1;
    }
}