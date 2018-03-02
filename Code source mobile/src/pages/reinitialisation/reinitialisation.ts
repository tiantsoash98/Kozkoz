import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { RecuperationService } from '../../services/recuperation.service';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-reinitialisation',
  templateUrl: 'reinitialisation.html'
})
export class ReinitialisationPage {

    email: string;
    password1: string;
    password2: string;

    constructor(public navCtrl: NavController, public navParams: NavParams,public alertCtrl: AlertController, public loadingCtrl: LoadingController, private recuperationService: RecuperationService) {
        this.email = this.navParams.get('email');
    }


    reinitialiser(){
        if(this.password1 != this.password2){
            this.doAlert('Erreur', 'Les mots de passes ne sont pas identiques');
        }
        else{
            let loading = this.loadingCtrl.create({
                content: 'Veuillez patienter...'
            });
    
            loading.present();
    
            this.recuperationService.reinitialiser(this.email, this.password1)
                .then(response =>{
                    loading.dismiss();
    
                    if(response.status == '0'){
                        this.doAlert('Erreur', 'Le compte est invalide');
                    }
                    else if(response.status == '1'){
                        this.doAlert('Succès', 'Mode de passe modifie avec succes!');
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

}
