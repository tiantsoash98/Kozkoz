package com.example.kozkoz.service;

import com.example.kozkoz.mapping.Token;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class TokenServiceImpl implements  TokenService {
    private MongoTemplate template;

    public  TokenServiceImpl(MongoTemplate template){ this.template = template; }

    @Override
    public void cleanOutdatedTokens() {
        template.remove(new Query(Criteria.where("expire").lte(new Date().getTime())), Token.class);
    }

    @Override
    public void cleanOutdatedToken(String utilisateur) {
        template.remove(new Query(Criteria.where("utilisateur.email").is(utilisateur).and("expire").lte(new Date().getTime())), Token.class);
    }

    @Override
    public void deleteUserToken(String utilisateur) {
        template.remove(new Query(Criteria.where("utilisateur.email").is(utilisateur)), Token.class);
    }

    @Override
    public Token findByCode(String code) {
        return template.findOne(new Query(Criteria.where("code").is(code)), Token.class);
    }

    @Override
    public Token findByUser(String utilisateur) {
        return template.findOne(new Query(Criteria.where("utilisateur.email").is(utilisateur)), Token.class);
    }

    @Override
    public int verifCode(String code, String utilisateur) throws Exception{
        Token token = this.findByCode(code);

        if(token == null)
            throw new Exception("{'status': 50, 'error': 'Le code n est pas valide'}".replaceAll("'", "\""));

        if(!token.getUtilisateur().getEmail().equals(utilisateur))
            throw new Exception("{'status': 51, 'error': 'Le code n est pas valide'}".replaceAll("'", "\""));

        if(token.getExpire() < new Date().getTime())
            throw new Exception("{'status': 52, 'error': 'Le code est expiré'}".replaceAll("'", "\""));

        return 0;
    }
}
