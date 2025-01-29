package com.example.instagramclone.domain.post.dto.response;

import com.example.instagramclone.domain.post.entity.PostImage;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter
@ToString
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostImageResponseDto {

    @JsonProperty("image_id")
    private Long id;

    private String imageUrl;

    private int imageOrder;

    // 정적 팩토리 메서드
    public static PostImageResponseDto from(PostImage postImage) {
        return PostImageResponseDto.builder()
                .id(postImage.getId())
                .imageUrl(postImage.getImageUrl())
                .imageOrder(postImage.getImageOrder())
                .build();
    }

}
