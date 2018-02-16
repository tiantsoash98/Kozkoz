import { Injectable }   from '@angular/core';
import { Http }         from '@angular/http';

import { WebServiceParams } from '../models/webServiceParams.model';


@Injectable()
export class RecuperationService extends WebServiceParams{

    constructor(private http: Http) {
        super();
    }

    public envoyerEmail(email){
        const url = this.serverUrl + '/recuperation?email='+email;
  
        return this.http.get(url)
        .toPromise()
        .then(response => response.json())
        .catch(error => console.log('Une erreur est survenue ' + error))  
    }

    public envoyerCode(code, email){
        const url = this.serverUrl + '/verification-code?code='+code+'&email='+email;
  
        return this.http.get(url)
        .toPromise()
        .then(response => response.json())
        .catch(error => console.log('Une erreur est survenue ' + error))  
    }

    public reinitialiser(email, password){
        const url = this.serverUrl + '/reinitialiser-password?email='+email+'&password='+password;
  
        return this.http.get(url)
        .toPromise()
        .then(response => response.json())
        .catch(error => console.log('Une erreur est survenue ' + error))  
    }
}