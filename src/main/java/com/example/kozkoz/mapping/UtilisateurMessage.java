package com.example.kozkoz.mapping;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class UtilisateurMessage {

    @Id
    private String id;
    private String nom;
    private String prenom;
    private String naissance;
    private String sexe;
    private String email;
    private String photo;
}
