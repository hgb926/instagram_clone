package com.example.instagramclone.repository;

import com.example.instagramclone.domain.hashtag.dto.response.HashtagSearchResponseDto;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
@Rollback
class HashtagRepositoryTest {

    @Autowired
    HashtagRepository hashtagRepository;

    @Test
    void searchHashtagsByKeyword() {

        String keyword = "do";
        List<HashtagSearchResponseDto> hashtagSearchResponseDtos = hashtagRepository.searchHashtagsByKeyword(keyword);
        hashtagSearchResponseDtos.forEach(System.out::println);
    }
}