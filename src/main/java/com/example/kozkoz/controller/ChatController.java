package com.example.kozkoz.controller;

import com.example.kozkoz.mapping.Bip;
import com.example.kozkoz.mapping.Blocage;
import com.example.kozkoz.mapping.Message;
import org.springframework.beans.factory.annotation.Autowired;
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
public class ChatController {
    private SimpMessagingTemplate messagingTemplate;
    private MongoTemplate template;

    @Autowired
    public ChatController (SimpMessagingTemplate messagingTemplate, MongoTemplate template){
        this.messagingTemplate = messagingTemplate;
        this.template = template;
    }

    @MessageMapping("/send/message")
    public void onReceiveMessage(Message message){
        template.save(message);
        this.messagingTemplate.convertAndSend("/listen/message/"+message.getDestinataire().getId(), message);

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
    public List<Message> initMessagesUtilisateur(@RequestParam String utilisateur, @RequestParam String partenaire){
        Criteria criteria = new Criteria().orOperator(Criteria.where("envoyeur.email").is(utilisateur).and("destinataire.email").is(partenaire), Criteria.where("envoyeur.email").is(partenaire).and("destinataire.email").is(utilisateur));
        return template.find(new Query(criteria), Message.class);
    }

    @RequestMapping("/init-messages")
    public List<Message> initMessages(@RequestParam String utilisateur){
        Criteria criteria = new Criteria().orOperator(Criteria.where("envoyeur.email").is(utilisateur), Criteria.where("destinataire.email").is(utilisateur));
        return template.find(new Query(criteria), Message.class, "dernierMessage");
    }
}
