package com.example.instagramclone.exception;

import lombok.Getter;

@Getter
public class PostException extends RuntimeException {

    // 피드 생성 전담 errorCode
    private final ErrorCode errorCode;

    public PostException(ErrorCode errorCode) {
        this.errorCode = errorCode;
    }

    public PostException(ErrorCode errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }

}
