package com.example.kozkoz.mapping;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@AllArgsConstructor
@NoArgsConstructor

@Document(collection = "blocage")
public class Blocage {
    public static  int Message = 10;
    public static  int Coucou = 20;

    private UtilisateurMessage envoyeur;
    private UtilisateurMessage destinataire;
    private String date;
    private int type;
}
