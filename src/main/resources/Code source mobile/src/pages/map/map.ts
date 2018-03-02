import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, ViewController} from 'ionic-angular';
import { ActiviteService } from '../../services/activite.service';
import { ActualisationService } from '../../services/actualisation.service';
import { PageParams } from '../../models/pageParams.model';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { Activite } from '../../models/activite.model';


declare var google;

@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage extends PageParams{
  @ViewChild('map') mapElement: ElementRef;
  map: any;
 
  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public alertCtrl: AlertController, public activiteService: ActiviteService, public actualisationService: ActualisationService) {
    super(navCtrl, alertCtrl, activiteService);
  }
 
  ionViewDidLoad(){
    this.loadMap();
  }
 
  loadMap(){
    let position = this.activiteService.getCurrentPosition();
    let latLng = new google.maps.LatLng(position.lat, position.lng);
 
    let mapOptions = {
      center: latLng,
      zoom: 20,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
 
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    this.initListActifs(this.map);
  }

  initListActifs(map){
    for(var i = 0; i < this.activiteService.listActif.length; i++){
      this.addMarkers(this.activiteService.listActif[i], map);
    }
  }

  addMarkers(actif: Activite, map){
    let marker = new google.maps.Marker({
      map: map,
      animation: google.maps.Animation.DROP,
      position: new google.maps.LatLng(actif.localisation.lat, actif.localisation.lng)
    });

    let infoWindow = new google.maps.InfoWindow({
      content: this.getContentInfoWindow(actif)
    });
   
    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
  }

  getContentInfoWindow(actif: Activite): string{
    let content : string = "";

    content += "<h4>"+ actif.utilisateur.prenom + " " + actif.utilisateur.nom +"</h4>";
    content += "<p>"+ actif.statut +"</p>";
    /*content +=    "<ion-item (tap)=\"dismiss()\"> Envoyer un message </ion-item>";
    content +=    "<ion-item> Faire coucou </ion-item>";
    content += "</ion-list>";*/
    return content;
  }

  private dismiss(){
    this.viewCtrl.dismiss();
  }
}