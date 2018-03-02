package com.example.kozkoz.mapping;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@AllArgsConstructor
@NoArgsConstructor

@Document(collection = "token")
public class Token {
    private  String code;
    private  UtilisateurMessage utilisateur;
    private  long expire;
}
