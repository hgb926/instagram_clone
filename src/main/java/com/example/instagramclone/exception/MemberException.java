package com.example.instagramclone.exception;

import lombok.Getter;

@Getter
public class MemberException extends RuntimeException {

    // 피드 생성 전담 errorCode
    private final ErrorCode errorCode;

    public MemberException(ErrorCode errorCode) {
        this.errorCode = errorCode;
    }

    public MemberException(ErrorCode errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }

}
