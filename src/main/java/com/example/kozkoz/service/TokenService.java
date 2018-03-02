package com.example.kozkoz.service;

import com.example.kozkoz.mapping.Token;

public interface TokenService {
    void cleanOutdatedTokens();
    void cleanOutdatedToken(String utilisateur);
    void deleteUserToken(String utilisateur);
    Token findByCode(String code);
    Token findByUser(String utilisateur);
    int verifCode(String code, String utilisateur) throws  Exception;
}
