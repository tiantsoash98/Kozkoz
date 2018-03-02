import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { RecuperationService } from '../../services/recuperation.service';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { ReinitialisationPage } from '../reinitialisation/reinitialisation';

@Component({
  selector: 'page-code',
  templateUrl: 'code.html'
})
export class CodePage {

    code: string;
    email: string;

    constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public loadingCtrl: LoadingController, private recuperationService: RecuperationService) {
        this.email = this.navParams.get('email');
    }


    envoyerCode(){
        let loading = this.loadingCtrl.create({
            content: 'Veuillez patienter...'
        });

        loading.present();

        this.recuperationService.envoyerCode(this.code, this.email)
            .then(response =>{
                loading.dismiss();

                if(response.status == '0'){
                    this.doAlert('Echec', 'Code invalide');
                }
                else if(response.status == '1'){
                    this.doAlert('Echec', 'Code expiré');
                }
                else if(response.status == '2'){
                    this.navCtrl.push(ReinitialisationPage, {email: this.email});
                }
            })  
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
