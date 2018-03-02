package com.example.kozkoz.mapping;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@AllArgsConstructor
@NoArgsConstructor

@Document(collection = "groupe")
public class Groupe {
    private String id;
    private String nom;
    private String date;
    private UtilisateurMessage createur;
    private UtilisateurMessage[] membres;
}
