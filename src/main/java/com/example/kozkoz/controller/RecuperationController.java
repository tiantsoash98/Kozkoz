package com.example.kozkoz.controller;

import com.example.kozkoz.mapping.Recuperation;
import com.example.kozkoz.mapping.Utilisateur;
import com.example.kozkoz.mapping.utilitaires.Configuration;
import com.example.kozkoz.mapping.utilitaires.Utilitaire;
import com.example.kozkoz.service.RecuperationService;
import com.example.kozkoz.service.UtilisateurService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailSender;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.mail.MessagingException;
import javax.mail.internet.AddressException;
import java.util.Date;

@RestController
@CrossOrigin(origins = "*")
public class RecuperationController {
    private UtilisateurService utilisateurService;
    private RecuperationService recuperationService;

    //@Autowired
    private MailSender mailSender;

    public RecuperationController(UtilisateurService utilisateurService, RecuperationService recuperationService, MailSender mailSender) {
        this.recuperationService = recuperationService;
        this.utilisateurService = utilisateurService;
        this.mailSender = mailSender;
    }

    @RequestMapping("/recuperation")
    String recuperation(@RequestParam String email){
        Utilisateur utilisateur =  this.utilisateurService.findUtilisateur(email);

        if(utilisateur == null)
            return Utilitaire.getJSONStatus(0);

        String code = Utilitaire.generateFullCode(6);

        Recuperation recuperation = new Recuperation();
        recuperation.setEmail(utilisateur.getEmail());
        recuperation.setCode(code);
        recuperation.setExpire(new Date().getTime() + Configuration.CodeExpireTime);
        recuperation.setValide(Recuperation.Valide);

        recuperationService.save(recuperation);

        try {
            String receveur = utilisateur.getEmail();
            String objet = "Récupération du mot de passe de votre compte InMalaz";
            String text = "Voici le code de récupération de votre compte InMalaz : " + code;

            SimpleMailMessage message = new SimpleMailMessage();
            message.setText(text);
            message.setSubject(objet);
            message.setTo(receveur);

            mailSender.send(message);
            //if(Utilitaire.sendMail(Configuration.SmtpServer, Configuration.EmailExpediteur, receveur, objet, text))
                return Utilitaire.getJSONStatus(3);
        }
        catch (Exception e){
            e.printStackTrace();
            return Utilitaire.getJSONStatus(1);
        }

        //return Utilitaire.getJSONStatus(2);
    }

    @RequestMapping("/verification-code")
    String validation(@RequestParam String code, @RequestParam String email){
        Recuperation recuperation = recuperationService.findRecuperation(code, email);

        if(recuperation == null)
            return Utilitaire.getJSONStatus(0);

        if(recuperation.getExpire() < new Date().getTime())
            return  Utilitaire.getJSONStatus(1);

        recuperationService.validerCode(recuperation.getCode());

        return Utilitaire.getJSONStatus(2);
    }

    @RequestMapping("/reinitialiser-password")
    String reinitialiserMdp(@RequestParam String email, @RequestParam String password){
        Utilisateur utilisateur = utilisateurService.findUtilisateur(email);

        if(utilisateur == null)
            return  Utilitaire.getJSONStatus(0);

        utilisateurService.updatePassword(email, Utilitaire.sha1(password));

        return  Utilitaire.getJSONStatus(1);
    }
}
