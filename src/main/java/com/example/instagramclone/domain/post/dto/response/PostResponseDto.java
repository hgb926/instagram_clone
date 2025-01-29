package com.example.instagramclone.domain.post.dto.response;

import com.example.instagramclone.domain.post.entity.PostImage;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

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

}
