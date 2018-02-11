package com.example.kozkoz.mapping.utilitaires;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Formatter;
import java.util.Properties;
import java.util.concurrent.ThreadLocalRandom;

public class Utilitaire {
    public static  String getJSONStatus(int status){
        return "{\"status\": "+ status +"}";
    }

    public static  int generateRandomCode(int length){
        return ThreadLocalRandom.current().nextInt(0, (int)Math.pow(10, length));
    }

    public static String generateFullCode(int length){
        int code = Utilitaire.generateRandomCode(length);

        String result = code + "";

        while (result.length() < length){
            result = "0" + result;
        }

        return result;
    }

    public static boolean sendMail(String smtpServer, String from, String to, String object, String text) throws Exception{
        Properties props = System.getProperties();
        props.put("mail.smtp.host", smtpServer);
        /* Session encapsule pour un client donné sa connexion avec le serveur de mails.*/
        Session session = Session.getDefaultInstance(props, null);

        /* Création du message*/
        Message msg = new MimeMessage(session);

        try {
            msg.setFrom(new InternetAddress(from));
            msg.setRecipients(Message.RecipientType.TO,InternetAddress.parse(to, false));
            msg.setSubject(object);
            msg.setText(text);
            msg.setHeader("X-Mailer", "LOTONtechEmail");
            Transport.send(msg);
        }
        catch (AddressException e) {
            e.printStackTrace();
            return false;
        }
        catch (MessagingException e) {
            e.printStackTrace();
            return false;
        }

        return true;
    }

    public static String sha1(String password)
    {
        String sha1 = "";
        try
        {
            MessageDigest crypt = MessageDigest.getInstance("SHA-1");
            crypt.reset();
            crypt.update(password.getBytes("UTF-8"));
            sha1 = byteToHex(crypt.digest());
        }
        catch(NoSuchAlgorithmException e)
        {
            e.printStackTrace();
        }
        catch(UnsupportedEncodingException e)
        {
            e.printStackTrace();
        }
        return sha1;
    }

    private static String byteToHex(final byte[] hash)
    {
        Formatter formatter = new Formatter();
        for (byte b : hash)
        {
            formatter.format("%02x", b);
        }
        String result = formatter.toString();
        formatter.close();
        return result;
    }
}
