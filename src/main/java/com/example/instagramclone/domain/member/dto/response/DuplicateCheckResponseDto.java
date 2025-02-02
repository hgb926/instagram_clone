package com.example.instagramclone.domain.member.dto.response;

import lombok.*;

@Getter
@ToString
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DuplicateCheckResponseDto {

    private boolean available; // 사용 가능 여부
    private String message; // 중복 검사 결과 메시지

    // 사용 가능할 경우 객체 생성 메서드
    public static DuplicateCheckResponseDto available() {
        return DuplicateCheckResponseDto.builder()
                .available(true)
                .build();
    }

    // 사용 불가능할 경우 객체 생성 메서드
    public static DuplicateCheckResponseDto unavailable(String message) {
        return DuplicateCheckResponseDto.builder()
                .available(false)
                .message(message)
                .build();
    }
}
