package com.example.instagramclone.controller.rest;

import com.example.instagramclone.domain.member.dto.request.LoginRequestDto;
import com.example.instagramclone.domain.member.dto.request.SignUpRequestDto;
import com.example.instagramclone.domain.member.dto.response.DuplicateCheckResponseDto;
import com.example.instagramclone.service.MemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final MemberService memberService;

    @PostMapping("/signup")
    public ResponseEntity<Map<String, Object>> signUp(@RequestBody @Valid SignUpRequestDto signUpRequest) {
        log.info("request for signup: {}", signUpRequest.getUsername());
        memberService.signUp(signUpRequest);

        return ResponseEntity.ok().body(Map.of(
                "message", "회원가입이 완료되었습니다.",
                "username", signUpRequest.getUsername()
        ));
    }

    // 중복확인을 검사하는 API
    @GetMapping("/check-duplicate")
    public ResponseEntity<DuplicateCheckResponseDto> duplicateCheck(
            @RequestParam String type,
            @RequestParam String value
    ) {
        log.info("check type : {}, value : {}", type, value);
        DuplicateCheckResponseDto responseDto = memberService.checkDuplicate(type, value);
        return ResponseEntity.ok().body(responseDto);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid LoginRequestDto loginRequest) {

        log.info("request for login: {}", loginRequest.getUsername());
        Map<String, Object> responseMap = memberService.authenticate(loginRequest);
        return ResponseEntity.ok().body(responseMap);
    }

}
