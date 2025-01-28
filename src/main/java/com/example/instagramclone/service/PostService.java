package com.example.instagramclone.service;

import com.example.instagramclone.domain.post.dto.request.PostCreate;
import com.example.instagramclone.domain.post.entity.Post;
import com.example.instagramclone.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class PostService {

    private final PostRepository postRepository;

    public void createFeed(PostCreate postCreate) {

        Post newPost = postCreate.toEntity();
        // 피드 게시물을 posts테이블에 insert
        postRepository.saveFeed(newPost);

        // 이미지들을 서버 (/uploads 폴더)에 저장

        // 이미지들을 db post_images 테이블에 insert

        // 컨트롤러에게 결과 반환
    };
}
