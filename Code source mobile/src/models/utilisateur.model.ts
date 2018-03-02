export class Utilisateur{
    id: string;
    nom: string;
    prenom: string;
    naissance: string;
    sexe: string;
    email: string;
    photo: string;

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