package com.example.kozkoz.service;

import com.example.kozkoz.mapping.Activite;
import com.example.kozkoz.mapping.UtilisateurMessage;
import com.example.kozkoz.mapping.utilitaires.Localisation;

import java.util.List;

public interface ActiviteService {
    void connect(UtilisateurMessage utilisateur, Localisation localisation, int etat);
    void disconnect(String email);
    void setActif(UtilisateurMessage utilisateur);
    void setDiscret(UtilisateurMessage utilisateur);
    void setPosition(UtilisateurMessage utilisateur, Localisation localisation);
    void updateActivite(Activite activite);

    List<Activite> getListActifs(Localisation localisation, double areaSize);
}
