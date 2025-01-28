package com.example.instagramclone.repository;

import com.example.instagramclone.domain.post.entity.Post;
import com.example.instagramclone.domain.post.entity.PostImage;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class PostRepositoryTest {

    @Autowired
    PostRepository postRepository;

    // 테스트는 케이스별 메서드를 한개씩 만듬

    @Test
    @DisplayName("make a feed test")
    void saveFeedTest() {
        //given
        Post givenPost = Post.builder()
                .content("테스트1")
                .writer("임시작성자")
                .build();
        //when
        postRepository.saveFeed(givenPost);
        //then
        Long id = givenPost.getId();
        System.out.println("id = " + id);
    }


    @Test
    @DisplayName("이미지 추가")
    void saveImagesAndFindImages() {
        //given
        Post feed = Post.builder()
                .writer("하츄핑")
                .content("ggg")
                .build();

        postRepository.saveFeed(feed);

        Long postId = feed.getId();
        PostImage image1 = PostImage.builder()
                .postId(postId)
                .imageOrder(1)
                .imageUrl("/uploads/first-image.jpg")
                .build();
        PostImage image2 = PostImage.builder()
                .postId(postId)
                .imageOrder(1)
                .imageUrl("/uploads/second-image.jpg")
                .build();
        //when
        postRepository.saveFeedImage(image1);
        postRepository.saveFeedImage(image2);

        List<PostImage> imageList = postRepository.findImagesByPostId(postId);
        //then
        imageList.forEach(System.out::println);
    }


}