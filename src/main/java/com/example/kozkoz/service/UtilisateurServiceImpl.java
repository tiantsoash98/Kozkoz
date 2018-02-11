package com.example.kozkoz.service;

import com.example.kozkoz.mapping.Utilisateur;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

@Service
public class UtilisateurServiceImpl implements UtilisateurService{
    MongoTemplate mongoTemplate;

    @Autowired
    public UtilisateurServiceImpl(MongoTemplate mongoTemplate){
        this.mongoTemplate = mongoTemplate;
    }

    @Override
    public String findUtilisateur(String email, String password) {
        Query query = new Query(Criteria.where("email").is(email));

        Utilisateur result =  mongoTemplate.findOne(query, Utilisateur.class);

        if(result == null)
            return "{\"status\":0, \"utilisateur\": {}}";

        if(!result.getPassword().equals(password))
            return "{\"status\":1, \"utilisateur\": {}}";

        String status =  "{'status':2, 'utilisateur':{'id':'"+result.getId()+"','nom':'"+result.getNom()+"','prenom':'"+result.getPrenom()+"','naissance':'"+result.getNaissance()+"','sexe':"+result.getSexe()+",'email':'"+result.getEmail()+"', 'photo':'"+ result.getPhoto()+"'}}";

        return status.replaceAll("'", "\"");
    }

    @Override
    public boolean updatePassword(String email, String password) {
        Query query = new Query(Criteria.where("email").is(email));
        Update update = new Update().set("password", password);
        mongoTemplate.updateFirst(query, update, Utilisateur.class);
        return true;
    }

    @Override
    public void save(Utilisateur utilisateur) {
        mongoTemplate.save(utilisateur);
    }

    public Utilisateur findUtilisateur(String email) {
        Query query = new Query(Criteria.where("email").is(email));
        return mongoTemplate.findOne(query, Utilisateur.class);
    }
}
