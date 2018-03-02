export class Utilisateur{
public    id: string;
public    nom: string;
public   prenom: string;
public   naissance: string;
public   sexe: string;
public   email: string;
public  photo: string;

    constructor(id:string, nom: string, prenom: string, naissance: string, sexe: string, email: string, photo: string){
        this.id = id;
        this.nom = nom;
        this.prenom = prenom;
        this.naissance = naissance;
        this.sexe = sexe;
        this.email = email;
        this.photo = photo;
    }
}