import { Utilisateur } from "./utilisateur.model";

export class Message{
    contenu: string;
    envoyeur: Utilisateur;
    destinataire: Utilisateur;
    date: string;
    type: number;

    constructor(contenu: string, envoyeur: Utilisateur, destinataire: Utilisateur, date: string, type: number){
        this.contenu = contenu;
        this.envoyeur = envoyeur;
        this.destinataire = destinataire;
        this.date = date;
        this.type = type;
    }
}