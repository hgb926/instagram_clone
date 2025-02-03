package com.example.instagramclone.service;

import com.example.instagramclone.domain.member.dto.request.LoginRequestDto;
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

import java.util.Map;

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

    // 로그인 처리 (인증 처리)
    /*
        1. 클라이언트가 전달한 계정명(이메일, 전화번호, 유저네임)과 패스워드를 받아야 함
        2. 계정명을 데이터베이스에 조회해서 존재하는지 유무를 확인 (가입 여부 조회)
        3. 존재한다면 회원정보를 데이터베이스에서 받아와서 비밀번호를 꺼내옴 (비밀번호 일치 여부 조회)
        4. 패스워드 일치를 검사
     */
    @Transactional(readOnly = true) // select만 하고있기에 transactional을 걸어줌
    public Map<String, Object> authenticate(LoginRequestDto dto) {
        String username = dto.getUsername();

        // 1
        Member foundMember = memberRepository.findByEmail(username)
                .orElseThrow(
                        () -> new MemberException(ErrorCode.MEMBER_NOT_FOUND, "존재하지 않는 회원입니다.")
                );// 조회가 실패했다면 예외 발생

        // 사용자가 입력한 패스워드와 DB에 저장된 패스워드를 추출
        String inputPassword = dto.getPassword();
        String storedPassword = foundMember.getPassword();

        // 비번이 일치하지 않으면 예외 발생
        if (!passwordEncoder.matches(inputPassword, storedPassword)) {
            throw new MemberException(ErrorCode.INVALID_PASSWORD);
        }

        // 로그인이 성공했을 때
        return Map.of(
                "message", "로그인에 성공했습니다.",
                "username", foundMember.getUsername()
        );
    }

}
