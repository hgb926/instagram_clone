package com.example.instagramclone.controller.rest;

import com.example.instagramclone.domain.post.dto.request.PostCreate;
import com.example.instagramclone.service.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.Value;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@Slf4j
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    // @RequestPart -
    // 기본적인 header는 content-type: application/json을 쓰지만 그외 (사진, 동영상 등등)의 파일이라면
    // content-type: image/jpg 이런식으로 header를 보내야한다, 그래서 이 두개는 같이 사용할 수 없지만
    // @RequestPart를 사용하면 boundary를 통해서 구분지어 *한번에* 전송 가능

    @PostMapping
    public ResponseEntity<?> createFeed(
            // 피드 내용, 작성자 이름 JSON { "writer": "", "content": "" } -> 검증
            @RequestPart("feed") @Valid PostCreate postCreate
            // 이미지 파일 목록 multipart-file
            , @RequestPart("images") List<MultipartFile> images
    ) {

        images.forEach(image -> {
            log.info("uploaded image file name - {}", image.getOriginalFilename());
        });

        postCreate.setImages(images);
        log.info("feed create request: POST - {}", postCreate);

        // 이미지와 JSON을 서비스클래스로 전송
        Long postId = postService.createFeed(postCreate);

        return ResponseEntity
                .ok()
                .body("success to create feed : id - " + postId);
    }

}
