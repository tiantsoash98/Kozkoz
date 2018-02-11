package com.example.kozkoz.mapping;

import com.example.kozkoz.mapping.utilitaires.Localisation;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor

@Document(collection = "historiqueUtilisation")
public class HistoriqueUtilisation {
    private UtilisateurMessage utilisateur;
    private Date debut;
    private Localisation localisationDebut;
    private Date fin;
    private Localisation localisationFin;
}
