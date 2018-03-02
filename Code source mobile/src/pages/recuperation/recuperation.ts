import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { RecuperationService } from '../../services/recuperation.service';
import { CodePage } from '../code/code';

@Component({
  selector: 'page-recuperation',
  templateUrl: 'recuperation.html'
})
export class RecuperationPage {

    email: string;

    constructor(public navCtrl: NavController, public alertCtrl:AlertController, public loadingCtrl: LoadingController, private recuperationService: RecuperationService) {

    }


    recuperation(){
        let loading = this.loadingCtrl.create({
            content: 'Veuillez patienter...'
        });

        loading.present();

        this.recuperationService.envoyerEmail(this.email)
            .then(response =>{
                loading.dismiss();

                if(response.status == '0'){
                    this.doAlert('Compte inexistant', 'Aucun compte ne correspond a cet email');
                }
                else if(response.status == '1'){
                    this.doAlert('Echec', 'Echec lors de la requete de recuperation');
                }
                else if(response.status == '2'){
                    this.doAlert('Echec', 'L\'adresse email est indisponible');
                }
                else if(response.status == '3'){
                    this.navCtrl.push(CodePage, {email: this.email});
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
