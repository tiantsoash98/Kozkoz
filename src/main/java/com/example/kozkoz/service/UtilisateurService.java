package com.example.kozkoz.service;

import com.example.kozkoz.mapping.Utilisateur;

public interface UtilisateurService {
    void save(Utilisateur utilisateur);
    Utilisateur findUtilisateur(String email);
    String findUtilisateur(String email, String password);
    boolean updatePassword(String email, String password);
}
