package com.example.kozkoz.mapping;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@AllArgsConstructor
@NoArgsConstructor

@Document(collection = "recuperation")
public class Recuperation {
    public static int Valide = 1;
    public static int NonValide = 0;

    @Id
    private String id;

    private String email;
    private String code;
    private long expire;
    private int valide;
}
