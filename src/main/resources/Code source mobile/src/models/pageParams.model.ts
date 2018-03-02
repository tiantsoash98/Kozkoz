import { Utilisateur } from "./utilisateur.model";
import { ActiviteService } from "../services/activite.service";
import { AlertController } from "ionic-angular/components/alert/alert-controller";
import { NavController } from "ionic-angular/navigation/nav-controller";
import { LoginPage } from "../pages/login/login";

export class PageParams{
    connected: Utilisateur;

    constructor(public navCtrl: NavController, public alertCtrl: AlertController, public activiteService: ActiviteService){
        this.connected = this.activiteService.getConnected();

        if(this.connected == null){
            this.alertCtrl.create({
                title: 'Erreur',
                message: 'Vous devez vous connecter',
                buttons: ['OK']
            }).present();

            this.navCtrl.setRoot(LoginPage);
        }
    }
}