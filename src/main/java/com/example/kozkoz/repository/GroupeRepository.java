package com.example.kozkoz.repository;

import com.example.kozkoz.mapping.Groupe;
import com.example.kozkoz.mapping.UtilisateurMessage;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface GroupeRepository extends MongoRepository<Groupe, String>{
    List<Groupe> findGroupesByMembresContaining(UtilisateurMessage utilisateurMessage);
}
