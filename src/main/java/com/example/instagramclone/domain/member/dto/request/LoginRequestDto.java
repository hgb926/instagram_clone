package com.example.instagramclone.domain.member.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@ToString
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginRequestDto {

    @NotBlank(message = "이메일, 전화번호, 사용자이름중 하나는 필수입니다.")
    private String username;

    @NotBlank(message = "비밀번호는 필수입니당.")
    private String password;


}
