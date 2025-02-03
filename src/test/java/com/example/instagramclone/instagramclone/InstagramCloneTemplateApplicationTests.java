package com.example.instagramclone.instagramclone;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.security.SecureRandom;
import java.util.Base64;

@SpringBootTest
class InstagramCloneTemplateApplicationTests {

    @Test
    @DisplayName("JWT 발급에 필요한 비밀키 작성")
    void contextLoads() {
        SecureRandom secureRandom = new SecureRandom();
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);
        String secretKey = Base64.getEncoder().encodeToString(bytes);
        System.out.println("secretKey = " + secretKey);
    }

}
