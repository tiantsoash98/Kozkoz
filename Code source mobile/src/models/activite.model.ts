import { Utilisateur } from "./utilisateur.model";
import { Localisation } from "./localisation.model";

export class Activite{
    utilisateur: Utilisateur;
    localisation: Localisation;
    etat: number;
    statut: string;
}