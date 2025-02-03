package com.example.instagramclone.service;

import com.example.instagramclone.domain.member.dto.request.SignUpRequestDto;
import com.example.instagramclone.domain.member.dto.response.DuplicateCheckResponseDto;
import com.example.instagramclone.domain.member.entity.Member;
import com.example.instagramclone.exception.ErrorCode;
import com.example.instagramclone.exception.MemberException;
import com.example.instagramclone.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@Transactional
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    // 회원가입 중간처리
    public void signUp(SignUpRequestDto dto) {

        /*
            Race condition 방지

            사용자가 중복체크 후 회원가입 버튼을 누르기 전까지의 시간동안
            다른 사용자가 같은 값으로 가입할 수 있음
            이를 최종회원가입에서 한번 더 검사해서 방지
         */
        String emailOrPhone = dto.getEmailOrPhone();
        if (emailOrPhone.contains("@")) {
            memberRepository.findByEmail(emailOrPhone)
                    .ifPresent(m -> {throw new MemberException(ErrorCode.DUPLICATE_EMAIL);});
        } else {
            memberRepository.findByPhone(emailOrPhone)
                    .ifPresent(m -> {throw new MemberException(ErrorCode.DUPLICATE_PHONE);});
        }

        memberRepository.findByUsername(dto.getUsername())
                .ifPresent(m -> {throw new MemberException(ErrorCode.DUPLICATE_USERNAME);});


        // 순수 비밀번호
        String rawPassword = dto.getPassword();
        // 암호화된 패스워드
        String encodedPassword = passwordEncoder.encode(rawPassword);

        // 회원정보를 엔터티로 변환
        Member newMember = dto.toEntity();
        // 패스워드를 인코딩 패스워드로 교체
        newMember.setPassword(encodedPassword);

        // 회원정보를 데이터베이스에 저장
        memberRepository.insert(newMember);
    }

    /**
     * 중복 검사 통합 처리 (이메일, 전화번호, 유저네임)
     *
     * @param type  - 검사할 값의 타입 (email, phone, username)
     * @param value - 실제로 중복을 검사할 값
     */
    public DuplicateCheckResponseDto checkDuplicate(String type, String value) {
        switch (type) {
            case "email":
                // 중복된 경우를 클라이언트에게 알려야 함
                return memberRepository.findByEmail(value)
                        .map(m -> DuplicateCheckResponseDto.unavailable("이미 사용 중인 이메일입니다."))
                        .orElse(DuplicateCheckResponseDto.available());
            case "phone":
                return memberRepository.findByPhone(value)
                        .map(m -> DuplicateCheckResponseDto.unavailable("이미 사용 중인 전화번호입니다."))
                        .orElse(DuplicateCheckResponseDto.available());
            case "username":
                return memberRepository.findByUsername(value)
                        .map(m -> DuplicateCheckResponseDto.unavailable("이미 사용 중인 사용자 이름입니다."))
                        .orElse(DuplicateCheckResponseDto.available());
            default:
                throw new MemberException(ErrorCode.INVALID_SIGNUP_DATA);
        }
    }

}
