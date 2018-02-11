package com.example.kozkoz.controller;

import com.example.kozkoz.mapping.Utilisateur;
import com.example.kozkoz.mapping.utilitaires.Utilitaire;
import com.example.kozkoz.service.UtilisateurService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.text.SimpleDateFormat;
import java.util.Date;

@RestController
@CrossOrigin(origins = "*")
public class LoginController {
    private UtilisateurService utilisateurService;

    public LoginController(UtilisateurService service) {
        this.utilisateurService = service;
    }

    @RequestMapping("/verification")
    String login(@RequestParam String email, @RequestParam String password){
        return this.utilisateurService.findUtilisateur(email, Utilitaire.sha1(password));
    }

    @RequestMapping("/inscription")
    String inscription(@RequestParam String nom, @RequestParam String prenom, @RequestParam String naissance, @RequestParam String sexe, @RequestParam String email, @RequestParam String password){
        try{
            SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
            int iSexe = Integer.parseInt(sexe);
            String cryptedPassowrd = Utilitaire.sha1(password);

            Date dNaisssance = formatter.parse(naissance);
            dNaisssance.setDate(dNaisssance.getDate() + 1);

            utilisateurService.save(new Utilisateur(null, nom, prenom, dNaisssance, iSexe, email, cryptedPassowrd, "", Utilisateur.NORMAL));
        }
        catch(Exception e){
            if(e.getClass().getSimpleName().equals("DuplicateKeyException"))
                return  Utilitaire.getJSONStatus(1);

            return Utilitaire.getJSONStatus(0);
        }

        return Utilitaire.getJSONStatus(2);
    }
}
