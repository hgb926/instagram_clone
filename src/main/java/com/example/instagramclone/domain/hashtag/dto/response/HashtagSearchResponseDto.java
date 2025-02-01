package com.example.instagramclone.domain.hashtag.dto.response;

import lombok.*;

@Getter
@ToString
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HashtagSearchResponseDto {

    private String hashtag;
    private int feedCount;
}
