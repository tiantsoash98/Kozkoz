package com.example.kozkoz.service;

import com.example.kozkoz.mapping.Recuperation;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

@Service
public class RecuperationServiceImpl implements  RecuperationService{
    MongoTemplate mongoTemplate;

    public RecuperationServiceImpl(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @Override
    public void save(Recuperation recuperation) {
        this.mongoTemplate.save(recuperation);
    }

    @Override
    public Recuperation findRecuperation(String code, String email) {
        Query query = new Query(Criteria.where("code").is(code).and("email").is(email).and("valide").is(Recuperation.Valide));
        return mongoTemplate.findOne(query, Recuperation.class);
    }

    @Override
    public boolean validerCode(String code) {
        Query query = new Query(Criteria.where("code").is(String.valueOf(code)));
        Update update = new Update().set("valide", Recuperation.NonValide);
        mongoTemplate.updateFirst(query, update, Recuperation.class);
        return true;
    }
}
