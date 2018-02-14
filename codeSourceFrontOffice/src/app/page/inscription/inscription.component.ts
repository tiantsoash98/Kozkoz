import { Component, OnInit } from '@angular/core';

import { UtilisateurService } from '../../services/utilisateur.service';

  

  @Component({
    selector: 'app-inscription',
    templateUrl: './inscription.component.html',
    styleUrls: ['./inscription.component.css']
  })
  export class InscriptionComponent implements OnInit {
    inscriptionData: any = {};
    
    constructor( private utilisateurService: UtilisateurService) { }

    ngOnInit() {}
    
    onSubmit(){
    
      if(this.inscriptionData.password1 != this.inscriptionData.password2){
        alert('Erreur : Les mots de passe ne sont pas identiques');
    }
    else{
        

        this.utilisateurService.inscription(this.inscriptionData.nom, this.inscriptionData.prenom, this.inscriptionData.naissance, this.inscriptionData.sexe, this.inscriptionData.email, this.inscriptionData.password1)
            .then(result =>{

                if(result.status == '0'){
                    alert('Echec : Le compte n\'a pas pu être créé');
                }
                else if(result.status == '1'){
                    alert('Erreur : Un compte associé à cette adresse email existe déjà');
                }
                if(result.status == '2'){
                    alert('Succès : Compte créé avec succès! \nVeuillez vous connecter');
                    window.location.href='login';
                }
            })  
    }   
    }

}
