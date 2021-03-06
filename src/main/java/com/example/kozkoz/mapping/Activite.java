package com.example.kozkoz.mapping;

import com.example.kozkoz.mapping.utilitaires.Localisation;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@AllArgsConstructor
@NoArgsConstructor

@Document(collection = "activite")
public class Activite {
    public  static  int DISCRET = 10;
    public  static  int VISIBLE = 20;

    private UtilisateurMessage utilisateur;
    private Localisation localisation;
    private int etat;
    private String statut;
}
