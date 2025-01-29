package com.example.instagramclone.domain.post.dto.response;

import com.example.instagramclone.domain.post.entity.Post;
import com.example.instagramclone.domain.post.entity.PostImage;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@ToString
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostResponseDto {

    @JsonProperty("feed_id")
    private Long id;

    private String content;

    private String writer;

    private List<PostImageResponseDto> images;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public static PostResponseDto from(Post post) {
        return PostResponseDto.builder()
                .id(post.getId())
                .writer(post.getWriter())
                .content(post.getContent())
                .images(post.getImages()
                        .stream()
                        .map(PostImageResponseDto::from)
                        .collect(Collectors.toList()))
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }

}
