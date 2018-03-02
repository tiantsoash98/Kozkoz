package com.example.kozkoz.repository;

import com.example.kozkoz.mapping.MessageGroupe;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MessageGroupeRepository extends MongoRepository<MessageGroupe, String> {
    MessageGroupe findByGroupeId(String id);
}
