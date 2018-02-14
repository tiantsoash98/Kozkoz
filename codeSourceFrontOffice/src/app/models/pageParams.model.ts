import { Utilisateur } from "./utilisateur.model";
import { LoginComponent } from "../page/login/login.component";

export class PageParams{
    connected: Utilisateur;

    constructor(){
        this.checkLogin();
    }
    checkLogin(){
        
        if(localStorage.getItem('utilisateurLogin') ==null ){
            alert('Erreur : vous devez vous connecter');
            window.location.href = 'login';
        }
        else{
            this.connected  = JSON.parse(localStorage.getItem('utilisateurLogin'));
    
        }

    }

    disconnect(){
        localStorage.clear();
    }
}