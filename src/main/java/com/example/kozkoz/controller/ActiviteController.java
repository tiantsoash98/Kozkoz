package com.example.kozkoz.controller;

import com.example.kozkoz.mapping.Activite;
import com.example.kozkoz.mapping.UtilisateurMessage;
import com.example.kozkoz.mapping.UtilisateurSecured;
import com.example.kozkoz.mapping.utilitaires.Configuration;
import com.example.kozkoz.mapping.utilitaires.Localisation;
import com.example.kozkoz.mapping.utilitaires.Utilitaire;
import com.example.kozkoz.service.ActiviteService;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
public class ActiviteController {
    private ActiviteService activiteService;
    private SimpMessagingTemplate messagingTemplate;
    private MongoTemplate template;


    public  ActiviteController(ActiviteService activiteService, MongoTemplate template, SimpMessagingTemplate messagingTemplate){
        this.activiteService = activiteService;
        this.template = template;
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/update/statut")
    public void onReceiveActiviteUpdate(Activite activite){
        activiteService.updateActivite(activite);
        this.messagingTemplate.convertAndSend("/listen/statut/", activite);
    }

    @RequestMapping("/connect")
    public String connect(@RequestParam String email, @RequestParam double lng, @RequestParam double lat, @RequestParam int etat){
        UtilisateurMessage utilisateur = template.findOne(new Query(Criteria.where("email").is(email)), UtilisateurMessage.class, "utilisateur");

        if(utilisateur == null)
            return Utilitaire.getJSONStatus(0);

        Localisation localisation = new Localisation(lng, lat);

        activiteService.connect(utilisateur, localisation, etat);
        return Utilitaire.getJSONStatus(1);
    }

    @RequestMapping("/disconnect")
    public String disconnect(@RequestParam String email){
        activiteService.disconnect(email);
        return Utilitaire.getJSONStatus(1);
    }

    @RequestMapping("/list-actifs")
    public List<Activite> getActifs(@RequestParam String email, @RequestParam double lng, @RequestParam double lat){
        UtilisateurSecured utilisateur = template.findOne(new Query(Criteria.where("email").is(email)), UtilisateurSecured.class, "utilisateur");

        if(utilisateur == null)
            return null;

        return activiteService.getListActifs(new Localisation(lng, lat), Configuration.DefaultAreaSize);
    }

    @RequestMapping("/activite")
    public Activite getActivite(@RequestParam String email){
        return template.findOne(new Query(Criteria.where("utilisateur.email").is(email)), Activite.class);
    }
}
