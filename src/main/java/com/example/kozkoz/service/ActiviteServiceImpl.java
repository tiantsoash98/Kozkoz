package com.example.kozkoz.service;

import com.example.kozkoz.mapping.Activite;
import com.example.kozkoz.mapping.HistoriqueUtilisation;
import com.example.kozkoz.mapping.UtilisateurMessage;
import com.example.kozkoz.mapping.utilitaires.Localisation;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;


@Service
public class ActiviteServiceImpl implements ActiviteService {
    MongoTemplate template;

    public ActiviteServiceImpl(MongoTemplate template){
        this.template = template;
    }

    @Override
    public void connect(UtilisateurMessage utilisateur, Localisation localisation, int etat) {
        if(template.findOne(new Query(Criteria.where("utilisateur.email").is(utilisateur.getEmail())), Activite.class) == null){
            template.save(new Activite(utilisateur, localisation, etat, ""));
            template.save(new HistoriqueUtilisation(utilisateur, new Date(), localisation, null, null));
        }
    }

    @Override
    public void disconnect(String email) {

        Activite last = template.findOne(new Query(Criteria.where("utilisateur.email").is(email)), Activite.class);

        if(last != null){
            template.remove(new Query(Criteria.where("utilisateur.email").is(email)), Activite.class);

            Query query = new Query(Criteria.where("utilisateur.email").is(email));
            query.with(new Sort(Sort.Direction.DESC, "debut"));

            Update update = new Update().set("fin", new Date()).set("localisationFin", last.getLocalisation());

            template.updateFirst(query, update, HistoriqueUtilisation.class);
        }
    }



    @Override
    public void setActif(UtilisateurMessage utilisateur) {
        Query query = new Query(Criteria.where("utilisateur.id").is(utilisateur.getId()));
        Update update = new Update().set("etat", Activite.VISIBLE);

        template.upsert(query, update, Activite.class);
    }

    @Override
    public void setDiscret(UtilisateurMessage utilisateur) {
        Query query = new Query(Criteria.where("utilisateur.email").is(utilisateur.getEmail()));
        Update update = new Update().set("etat", Activite.DISCRET);

        template.upsert(query, update, Activite.class);
    }

    @Override
    public void setPosition(UtilisateurMessage utilisateur, Localisation localisation) {
        Query query = new Query(Criteria.where("utilisateur.email").is(utilisateur.getEmail()));
        Update update = new Update().set("localisation", localisation);

        template.upsert(query, update, Activite.class);
    }

    @Override
    public void updateActivite(Activite activite) {
        Query query = new Query(Criteria.where("utilisateur.email").is(activite.getUtilisateur().getEmail()));
        Update update = new Update().set("localisation", activite.getLocalisation()).set("etat", activite.getEtat()).set("statut", activite.getStatut());

        template.upsert(query, update, Activite.class);
    }

    @Override
    public List<Activite> getListActifs(Localisation localisation, double areaSize) {
        Query query = new Query();
        return template.find(query, Activite.class);
    }
}
