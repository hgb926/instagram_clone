package com.example.instagramclone.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;

@Configuration
@EnableWebSecurity // 커스텀 시큐리티 설정파일이라는 의미
public class SecurityConfig {

    // 시큐리티 필터체인 빈을 등록
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        // 커스텀 보안 설정
        http
                .csrf(csrf -> csrf.disable()) // 스프링 시큐리티 기본 보안창 비활성화
                .cors(cors -> cors.configure(http))
                .sessionManagement(session ->  // 세션 인증을 비활성화
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                        )
                .authorizeHttpRequests(auth ->  // 인가 설정
                        auth
                                // 허용설정 - '/api/auth'로 시작하는 요청은 인증을 필요로 하지 않음
                                .requestMatchers("/api/auth/**").permitAll()
                                // 차단설정 - '/api'로 시작하는 요청은 모두 인증을 필수로 적용
                                .requestMatchers("/api/**").authenticated()
                                // 기타 등등 나머지 (jsp, css, js, image ....)는 모두 허용. RouteController
                                .anyRequest().permitAll()
                )
                // 시큐리티 기본 인증인가차단의 상태코드는 403으로 지정되어 있음
                // 그런데 403은 인가차단이지 인증차단코드가 아님, 인증차단은 401로 해야 적합함
                // 인가차단 - 403, 인증차단 - 401
                .exceptionHandling(ex ->
                        ex.authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)))
                ;

        return http.build();
    }

}
