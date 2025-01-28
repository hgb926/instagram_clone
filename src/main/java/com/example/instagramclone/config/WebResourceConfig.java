package com.example.instagramclone.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// 로컬에 저장된 파일을 서버에서 열 수 있도록 설정
@Configuration
@RequiredArgsConstructor
public class WebResourceConfig implements WebMvcConfigurer {

    private final FileUploadConfig fileUploadConfig;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {

        // 내 컴퓨터에 있는 img의 경로를 로컬의 url로 치환하는 메서드
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + fileUploadConfig.getLocation()); // 로컬 URL
    }
}
