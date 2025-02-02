package com.example.instagramclone.service;

import com.example.instagramclone.domain.member.dto.request.SignUpRequestDto;
import com.example.instagramclone.domain.member.entity.Member;
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

}
