package com.example.instagramclone.controller.rest;

import com.example.instagramclone.domain.post.dto.request.PostCreateDto;
import com.example.instagramclone.domain.post.dto.response.PostResponseDto;
import com.example.instagramclone.domain.post.entity.Post;
import com.example.instagramclone.exception.ErrorCode;
import com.example.instagramclone.exception.PostException;
import com.example.instagramclone.service.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/posts")
@Slf4j
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    // 피드 목록 조회 요청
    @GetMapping
    public ResponseEntity<?> getFeeds() {
        List<PostResponseDto> allFeeds = postService.findAllFeeds();
        return ResponseEntity
                .ok()
                .body(allFeeds);
    }



    // @RequestPart -
    // 기본적인 header는 content-type: application/json을 쓰지만 그외 (사진, 동영상 등등)의 파일이라면
    // content-type: image/jpg 이런식으로 header를 보내야한다, 그래서 이 두개는 같이 사용할 수 없지만
    // @RequestPart를 사용하면 boundary를 통해서 구분지어 *한번에* 전송 가능
    @PostMapping
    public ResponseEntity<?> createFeed(
            // 피드 내용, 작성자 이름 JSON { "writer": "", "content": "" } -> 검증
            @RequestPart("feed") @Valid PostCreateDto postCreateDto
            // 이미지 파일 목록 multipart-file
            , @RequestPart("images") List<MultipartFile> images
    ) {

        // 파일 업로드 개수 검증
        if (images.size() > 10) {
            throw new PostException(ErrorCode.TOO_MANY_FILES, "파일의 개수는 10개를 초과할 수 없습니다");
        }

        images.forEach(image -> {
            log.info("uploaded image file name - {}", image.getOriginalFilename());
        });

        postCreateDto.setImages(images);
        log.info("feed create request: POST - {}", postCreateDto);

        // 이미지와 JSON을 서비스클래스로 전송
        Long postId = postService.createFeed(postCreateDto);

        // 응답 메시지 JSON 생성 { "id": 23, "message": "save success" }
        Map<Object, Object> response = new HashMap<>();
        response.put("id", postId);
        response.put("message", "save success");

        return ResponseEntity
                .ok()
                .body(response);
    }

}
