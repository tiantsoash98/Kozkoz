import { Injectable }   from '@angular/core';
import { Http }         from '@angular/http';

import { WebServiceParams } from '../models/webServiceParams.model';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';


import { LoginCheck } from '../models/loginCheck.model';


@Injectable()
export class UtilisateurService extends WebServiceParams{

    constructor(private http: Http) {
        super();
    }

    public verificationLogin(email, password): Promise<any>{
        const url = this.serverUrl + '/verification?email='+email+'&password='+password;
  
        return this.http.get(url)
        .toPromise()
        .then(response => response.json() as LoginCheck)
        .catch(error => console.log('Une erreur est survenue ' + error))  
    }

    public inscription(nom, prenom, naissance, sexe, email, password): Promise<any>{
        const url = this.serverUrl + '/inscription?nom='+nom+'&prenom='+prenom+'&naissance='+naissance+'&sexe='+sexe+'&email='+email+'&password='+password;
  
        return this.http.get(url)
        .toPromise()
        .then(response => response.json() as LoginCheck)
        .catch(error => console.log('Une erreur est survenue ' + error))  
    }
}