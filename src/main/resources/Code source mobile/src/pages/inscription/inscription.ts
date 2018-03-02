import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { UtilisateurService } from '../../services/utilisateur.service';
import { LoginPage } from '../login/login';
import { ViewController } from 'ionic-angular/navigation/view-controller';

@Component({
  selector: 'page-inscription',
  templateUrl: 'inscription.html'
})
export class InscriptionPage {
    inscriptionData: any = {};

    constructor(public navCtrl: NavController, public viewCtrl: ViewController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, private utilisateurService: UtilisateurService) {

    }


    doInscription(){
        if(this.inscriptionData.password1 != this.inscriptionData.password2){
            this.doAlert('Erreur', 'Les mots de passe ne sont pas identiques');
        }
        else{
            let loading = this.loadingCtrl.create({
                content: 'Veuillez patienter...'
            });
    
            loading.present();
    
            this.utilisateurService.inscription(this.inscriptionData.nom, this.inscriptionData.prenom, this.inscriptionData.naissance, this.inscriptionData.sexe, this.inscriptionData.email, this.inscriptionData.password1)
                .then(result =>{
                    loading.dismiss();
    
                    if(result.status == '0'){
                        this.doAlert('Echec', 'Le compte n\'a pas pu être créé');
                    }
                    else if(result.status == '1'){
                        this.doAlert('Erreur', 'Un compte associé à cette adresse email existe déjà');
                    }
                    if(result.status == '2'){
                        this.doAlert('Succès', 'Compte créé avec succès! \nVeuillez vous connecter');
                        this.navCtrl.setRoot(LoginPage);
                    }
                })  
        }   
    }

    private doAlert(titre: string, message: string){
        let alert = this.alertCtrl.create({
            title: titre,
            message: message,
            buttons: ['OK']
        });

        alert.present();
    }

    private dismiss(){
        this.viewCtrl.dismiss();
    }
}
