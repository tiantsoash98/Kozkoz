package com.example.kozkoz.service;

import com.example.kozkoz.mapping.Recuperation;

public interface RecuperationService {
    void save(Recuperation recuperation);
    Recuperation findRecuperation(String code, String email);
    boolean validerCode(String code);
}
