package com.example.kozkoz.controller;

import com.example.kozkoz.mapping.Activite;
import com.example.kozkoz.mapping.Token;
import com.example.kozkoz.mapping.UtilisateurMessage;
import com.example.kozkoz.mapping.UtilisateurSecured;
import com.example.kozkoz.mapping.utilitaires.Configuration;
import com.example.kozkoz.mapping.utilitaires.Localisation;
import com.example.kozkoz.mapping.utilitaires.Utilitaire;
import com.example.kozkoz.service.ActiviteService;
import com.example.kozkoz.service.TokenService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jdk.nashorn.internal.ir.debug.JSONWriter;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
import java.util.List;

@RestController
@CrossOrigin(origins = "*")
public class ActiviteController {
    private ActiviteService activiteService;
    private SimpMessagingTemplate messagingTemplate;
    private TokenService tokenService;
    private MongoTemplate template;


    public  ActiviteController(ActiviteService activiteService, MongoTemplate template, SimpMessagingTemplate messagingTemplate, TokenService tokenService){
        this.activiteService = activiteService;
        this.template = template;
        this.messagingTemplate = messagingTemplate;
        this.tokenService = tokenService;
    }

    @MessageMapping("/update/statut")
    public void onReceiveActiviteUpdate(Activite activite){
        activiteService.updateActivite(activite);
        this.messagingTemplate.convertAndSend("/listen/statut/", activite);
    }

    @RequestMapping("/connect")
    public String connect(@RequestParam String email, @RequestParam String password, @RequestParam double lng, @RequestParam double lat, @RequestParam int etat){
        try{
            UtilisateurMessage utilisateur = template.findOne(new Query(Criteria.where("email").is(email).and("password").is(Utilitaire.sha1(password))), UtilisateurMessage.class, "utilisateur");

            if(utilisateur == null)
                return Utilitaire.getJSONStatus(0);

            Localisation localisation = new Localisation(lng, lat);

            activiteService.connect(utilisateur, localisation, etat);


            tokenService.cleanOutdatedToken(email);
            String code = Utilitaire.generateAlphaNumeric(Configuration.TokenLength);

            Token token = null;

            if((token = tokenService.findByUser(utilisateur.getEmail())) == null) {
                token = new Token(code, utilisateur, new Date().getTime() + Configuration.TokenExpireTime);
                template.save(token);
            }

            ObjectMapper mapper = new ObjectMapper();
            String jsonToken = mapper.writeValueAsString(token);

            return "{\"status\":1, \"token\":"+ jsonToken +"}";
        }
        catch (Exception e){
            return "{\"status\":0, \"error\":\""+ e.getMessage() +"\"}";
        }
    }

    @RequestMapping("/disconnect")
    public String disconnect(@RequestParam String email, @RequestParam String code){
        String result = "";

        try{
            this.tokenService.verifCode(code, email);

            activiteService.disconnect(email);
            tokenService.deleteUserToken(email);

            result = Utilitaire.getJSONStatus(1);
        }
        catch (Exception e){
            result = e.getMessage();
        }
        return result;
    }

    @RequestMapping("/list-actifs")
    public String getActifs(@RequestParam String email, @RequestParam double lng, @RequestParam double lat, @RequestParam String code){
        String result;

        try{
            this.tokenService.verifCode(code, email);

            UtilisateurSecured utilisateur = template.findOne(new Query(Criteria.where("email").is(email)), UtilisateurSecured.class, "utilisateur");

            if(utilisateur == null)
                return null;

            ObjectMapper mapper = new ObjectMapper();
            result = mapper.writeValueAsString(activiteService.getListActifs(new Localisation(lng, lat), Configuration.DefaultAreaSize));
        }
        catch (Exception e){
            result = e.getMessage();
        }

        return result;
    }

    @RequestMapping("/activite")
    public Activite getActivite(@RequestParam String email){
        return template.findOne(new Query(Criteria.where("utilisateur.email").is(email)), Activite.class);
    }
}
