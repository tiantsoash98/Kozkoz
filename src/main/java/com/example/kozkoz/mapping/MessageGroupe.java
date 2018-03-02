package com.example.kozkoz.mapping;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@AllArgsConstructor
@NoArgsConstructor

@Document(collection = "messageGroupe")
public class MessageGroupe {
    public static  int Text = 10;

    private String contenu;
    private UtilisateurMessage envoyeur;
    private Groupe groupe;
    private String date;
    private int type;
}
