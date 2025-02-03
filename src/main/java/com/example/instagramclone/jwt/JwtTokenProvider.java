package com.example.instagramclone.jwt;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
@RequiredArgsConstructor
public class JwtTokenProvider {

    private final JwtProperties jwtProperties;

    // 비밀키를 생성
    private SecretKey key;

    @PostConstruct
    public void init() {
        // Base64로 인코딩된 key를 디코딩 후, HMAC-SHA 알고리즘으로 다시 암호화
        this.key = Keys.hmacShaKeyFor(
                Decoders.BASE64.decode(jwtProperties.getSecretKey())
        );
    }

    // 토큰 발급 로직
    // 엑세스 토큰 생성 (사용자가 들고다닐 신분증) : 유효기간이 짧다.
    public String createAccessToken(String username) {
        return createToken(username, jwtProperties.getAccessTokenValidityTime());
    }
    // 리프레시 토큰 생성 (서버가 보관할 신분증을 재발급하기 위한 정보) : 유효기간이 비교적 길다.
    public String createRefreshToken(String username) {

        return createToken(username, jwtProperties.getRefreshTokenValidityTime());
    }

    // 공통 토큰 생성 로직
    // 엑세스,리프레시 생성 로직은 똑같고, 시간만 다르다
    private String createToken(String username, long validityTime) {

        // 현재 시간
        Date now = new Date();

        // 만료 시간
        Date validity = new Date(now.getTime() + validityTime);

        return Jwts.builder()
                .setIssuer("Instagram clone") // 발급자 정보 (주로 회사명)
                .setIssuedAt(now) // 발급 시간
                .setExpiration(validity) // 만료 시간
                .setSubject(username) // 토큰 식별자 (유일한 값)
                .compact();
    }

}
