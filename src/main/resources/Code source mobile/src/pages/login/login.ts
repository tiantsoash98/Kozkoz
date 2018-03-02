import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { Geolocation } from '@ionic-native/geolocation';

import { UtilisateurService } from '../../services/utilisateur.service';

import { TabsPage } from '../tabs/tabs';
import { InscriptionPage } from '../inscription/inscription';
import { RecuperationPage } from '../recuperation/recuperation';
import { ActiviteService } from '../../services/activite.service';
import { Localisation } from '../../models/localisation.model';
import { SocketService } from '../../services/socket.service';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
    loginData: any = {};

    constructor(public navCtrl: NavController, public modalCtrl: ModalController, public alertCtrl: AlertController, public loadingCtrl: LoadingController, private geolocation: Geolocation, private utilisateurService: UtilisateurService, private activiteService: ActiviteService, private socketService: SocketService) {

    }

    private displayTab(display:boolean) {
        let elements = document.querySelectorAll(".tabbar");
    
        if (elements != null) {
            Object.keys(elements).map((key) => {
                elements[key].style.transform = display ? 'translateY(0)' : 'translateY(56px)';
            });
        }
    }
    
    // Hide tabs bar
    ionViewDidEnter() {
        this.displayTab(false);
    } 

    ionViewWillLeave(){
        this.displayTab(true);
    }

    private doAlert(titre: string, message: string){
        let alert = this.alertCtrl.create({
            title: titre,
            message: message,
            buttons: ['OK']
        });

        alert.present();
    }

    login(){
        let loading = this.loadingCtrl.create({
            content: 'Veuillez patienter...'
        });

        loading.present();

        this.utilisateurService.verificationLogin(this.loginData.email, this.loginData.password)
            .then(utilisateurFetched =>{
                
                if(utilisateurFetched.status == '0'){
                    loading.dismiss();
                    this.doAlert('Erreur', 'Verifiez l\'email ou le mot de passe');
                }
                else if(utilisateurFetched.status == '1'){
                    loading.dismiss();
                    this.doAlert('Erreur', 'Mot de passe incorrect');
                }
                else if(utilisateurFetched.status == '2'){
                    this.activiteService.setConnected(utilisateurFetched.utilisateur);
 
                    /*this.activiteService.connect(utilisateurFetched.utilisateur.email, 47.53, -18.98, 20)
                        .then(response =>{
                            loading.dismiss();                     
                            this.activiteService.setCurrentPosition(new Localisation(47.53, -18.98)); 
                            this.activiteService.etat = 20;
                            this.activiteService.statut = ''; 
                            this.socketService.connect();                                      
                            this.navCtrl.setRoot(TabsPage);   
                        }); */

                    this.geolocation.getCurrentPosition()
                        .then((position) => {      

                            this.activiteService.connect(utilisateurFetched.utilisateur.email, position.coords.longitude, position.coords.latitude, 20)
                                .then(response =>{
                                    loading.dismiss();
                                    this.activiteService.setCurrentPosition(new Localisation(position.coords.longitude, position.coords.latitude));                           
                                    this.socketService.connect();
                                    this.navCtrl.setRoot(TabsPage);                          
                                });

                        }).catch((error) => {
                            loading.dismiss();
                            this.doAlert('Geolocation', 'Impossible d\'obtenir la position géographique');
                        });
                }
            })  
    }

    recuperation(){
        this.navCtrl.push(RecuperationPage);
    }

    inscription(){
        this.modalCtrl.create(InscriptionPage).present();
    }

}
