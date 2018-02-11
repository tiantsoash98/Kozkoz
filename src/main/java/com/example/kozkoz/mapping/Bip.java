package com.example.kozkoz.mapping;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@AllArgsConstructor
@NoArgsConstructor

@Document(collection = "bip")
public class Bip {
    public static  int Coucou = 10;

    private UtilisateurMessage envoyeur;
    private UtilisateurMessage destinataire;
    private String date;
    private int type;
}
