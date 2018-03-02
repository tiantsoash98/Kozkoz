package com.example.kozkoz.controller;

import com.example.kozkoz.mapping.*;
import com.example.kozkoz.mapping.utilitaires.Utilitaire;
import com.example.kozkoz.service.TokenService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.security.acl.Group;
import java.util.Date;
import java.util.List;

@RestController
@CrossOrigin(origins = "*")
public class ChatController {
    private SimpMessagingTemplate messagingTemplate;
    private MongoTemplate template;
    private TokenService tokenService;

    @Autowired
    public ChatController (SimpMessagingTemplate messagingTemplate, MongoTemplate template, TokenService tokenService){
        this.messagingTemplate = messagingTemplate;
        this.template = template;
        this.tokenService = tokenService;
    }

    @MessageMapping("/send/message")
    public void onReceiveMessage(Message message) {
        template.save(message);
        this.messagingTemplate.convertAndSend("/listen/message/" + message.getDestinataire().getId(), message);

        Criteria criteria = new Criteria().orOperator(Criteria.where("envoyeur.email").is(message.getEnvoyeur().getEmail()).and("destinataire.email").is(message.getDestinataire().getEmail()), Criteria.where("envoyeur.email").is(message.getDestinataire().getEmail()).and("destinataire.email").is(message.getEnvoyeur().getEmail()));

        Query query = new Query(criteria);
        template.remove(query, "dernierMessage");
        template.save(message, "dernierMessage");
    }

    @MessageMapping("/send/bip")
    public void onReceiveBip(Bip bip){
        //template.save(bip);
        this.messagingTemplate.convertAndSend("/listen/bip/"+bip.getDestinataire().getId(), bip);
    }

    @MessageMapping("/send/blocage")
    public void onReceiveBlocage(Blocage blocage){
        this.messagingTemplate.convertAndSend("/listen/blocage/"+blocage.getDestinataire().getId(), blocage);

        Criteria criteria = Criteria.where("envoyeur.email").is(blocage.getEnvoyeur().getEmail()).and("destinataire.email").is(blocage.getDestinataire().getEmail());

        if(template.findOne(new Query(criteria), Blocage.class) == null)
            template.save(blocage);
        else
            template.remove(new Query(criteria), Blocage.class);
    }

    @RequestMapping("/init-messages-utilisateur")
    public String initMessagesUtilisateur(@RequestParam String utilisateur, @RequestParam String partenaire, @RequestParam String code){
        String result = new String();

        try{
            this.tokenService.verifCode(code, utilisateur);

            Criteria criteria = new Criteria().orOperator(Criteria.where("envoyeur.email").is(utilisateur).and("destinataire.email").is(partenaire), Criteria.where("envoyeur.email").is(partenaire).and("destinataire.email").is(utilisateur));

            ObjectMapper mapper = new ObjectMapper();
            result = mapper.writeValueAsString(template.find(new Query(criteria), Message.class));
        }
        catch (Exception e){
            result = e.getMessage();
        }
        return result;
    }


    @RequestMapping("/init-last-messages-utilisateur")
    public String initLastMessageUtilisateur(@RequestParam String utilisateur, @RequestParam String code){
        String result = new String();

        try{
            this.tokenService.verifCode(code, utilisateur);

            Criteria criteria = new Criteria().orOperator(Criteria.where("envoyeur.email").is(utilisateur), Criteria.where("destinataire.email").is(utilisateur));

            ObjectMapper mapper = new ObjectMapper();
            result = mapper.writeValueAsString(template.find(new Query(criteria), Message.class, "dernierMessage"));
        }
        catch (Exception e){
            result = e.getMessage();
        }
        return result;
    }


    @MessageMapping("/send/init-groupe")
    public void onReceiveInitGroupe(MessageGroupe message){
        for(int i = 0; i < message.getGroupe().getMembres().length; i++){
            this.messagingTemplate.convertAndSend("/listen/message-groupe/"+message.getGroupe().getMembres()[i].getId(), message);
        }

        template.save(message);
        template.save(message, "dernierMessageGroupe");

        Update update = new Update().set("membres", message.getGroupe().getMembres());
        template.updateFirst(new Query(Criteria.where("id").is(message.getGroupe().getId())), update, Groupe.class);
    }

    @MessageMapping("/send/message-groupe")
    public void onReceiveMessageGroupe(MessageGroupe message){
        for(int i = 0; i < message.getGroupe().getMembres().length; i++){
            this.messagingTemplate.convertAndSend("/listen/message-groupe/"+message.getGroupe().getMembres()[i].getId(), message);
        }

        template.save(message);

        Criteria criteria = Criteria.where("groupe.id").is(message.getGroupe().getId());

        template.remove(new Query(criteria), "dernierMessageGroupe");
        template.save(message, "dernierMessageGroupe");
    }


    @RequestMapping("/init-messages-groupe")
    public String initMessagesGroupe(@RequestParam String utilisateur, @RequestParam String groupe, @RequestParam String code){
        String result = new String();

        try{
            this.tokenService.verifCode(code, utilisateur);

            ObjectMapper mapper = new ObjectMapper();
            result = mapper.writeValueAsString(template.find(new Query(Criteria.where("groupe.id").is(groupe)), MessageGroupe.class));
        }
        catch (Exception e){
            result = e.getMessage();
        }
        return result;
    }


    @RequestMapping("/init-last-messages-groupe")
    public String initLastMessageGroupe(@RequestParam String utilisateur, @RequestParam String code){
        String result = new String();

        try{
            this.tokenService.verifCode(code, utilisateur);

            ObjectMapper mapper = new ObjectMapper();
            result = mapper.writeValueAsString(template.find(new Query(), MessageGroupe.class, "dernierMessageGroupe"));
        }
        catch (Exception e){
            result = e.getMessage();
        }
        return result;
    }

    @RequestMapping("/creer-groupe")
    public String creerGroupe(@RequestParam String utilisateur, @RequestParam String nom, @RequestParam String code){
        String result = new String();

        try{
            this.tokenService.verifCode(code, utilisateur);

            UtilisateurMessage _envoyeur = template.findOne(new Query(Criteria.where("email").is(utilisateur)), UtilisateurMessage.class, "utilisateur");

            if(utilisateur == null)
                return Utilitaire.getJSONStatus(0);

            Groupe groupe = new Groupe(Utilitaire.generateAlphaNumeric(24), nom, new Date().toString(), _envoyeur, null);

            template.save(groupe);

            ObjectMapper mapper = new ObjectMapper();
            result = mapper.writeValueAsString(groupe);
        }
        catch (Exception e){
            result = e.getMessage();
        }
        return result;
    }
}
