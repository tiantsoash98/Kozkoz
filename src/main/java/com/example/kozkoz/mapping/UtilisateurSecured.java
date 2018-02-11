package com.example.kozkoz.mapping;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor

@Document(collection = "utilisateur")
public class UtilisateurSecured {
    public static int HOMME = 1;
    public static int FEMME = 2;

    public  static  int NORMAL = 0;
    public  static  int ADMIN = 1;


    @Id
    private  String id;
    private String nom;
    private String prenom;
    private Date naissance;
    private int sexe;

    private String email;
    private String photo;
    private int type;
}
