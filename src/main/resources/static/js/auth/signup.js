import { ValidationRules, checkPasswordStrength } from "./validation.js";
import {debounce} from "../util/debounce.js";


const fetchToSignUp = async (userData) => {
    const response = await fetch(`api/auth/signup`, {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(userData)
    });

    const data = await response.json();
    alert(data.message)
}


const initSignUp = () => {

    // form submit이벤트
    const $form = document.querySelector('.auth-form')

    // 입력 태그들을 읽어서 객체로 관리
    const $inputs = {
        emailOrPhone: $form.querySelector('input[name="email"]'),
        name: $form.querySelector('input[name="name"]'),
        username: $form.querySelector('input[name="username"]'),
        password: $form.querySelector('input[name="password"]'),
    }

    // 디바운스가 걸린 validateField 함수
    const debounceValidate = debounce(validateField, 700);

    const handleInput = ($input) => {
        removeErrorMessage($input.closest('.form-field'))
        debounceValidate($input) // 입력값 검증 함수 호출
    }

    Object.values($inputs).forEach($input => {
        $input.addEventListener('input', () => {
            handleInput($input)
        })
        $input.addEventListener('blur', () => {
            handleInput($input)
        })
    })

    $form.addEventListener('submit', e => {
        e.preventDefault() // 폼 전송시 발생하는 새로고침 방지
        // 사용자가 입력한 모든 입력값 읽어오기
        // const emailOrPhone = $form.querySelector('input[name="email"]').value;
        // const name = $form.querySelector('input[name="name"]').value;
        // const username = $form.querySelector('input[name="username"]').value;
        // const password = $form.querySelector('input[name="password"]').value;
        //
        // const payload = {
        //     emailOrPhone,
        //     name,
        //     username,
        //     password
        // }
        // if (payload) {
        //     fetchToSignUp(payload)
        // }

    })
}


// ==== 함수 정의 ==== //
// 입력값을 검증하고 에러메세지를 렌더링하는 함수
const validateField = ($input) => {

    // 이게 어떤태그인지 알아오기
    const fieldName = $input.name
    // 입력값 읽어오기
    const inputValue = $input.value.trim()
    // input의 부모 가져오기
    const $formField = $input.closest('.form-field')

    // 1. 빈 값 체크
    if (!inputValue) { // 값이 비어있을때
        showError($formField, ValidationRules[fieldName]?.requiredMessage); // 에러메시지 렌더링
    } else {
        // 2. 상세 체크 (패턴검증, 중복검증)
        // 2-1. 이메일, 전화번호 검증
        if (fieldName === 'email') validateEmailOrPhone($formField, inputValue)
        else if (fieldName === 'password') validatePassword($formField, inputValue)
        else if (fieldName === 'username') validateUsername($formField, inputValue)
    }
}

const showError = ($formField, message) => {
    $formField.classList.add('error')
    const $errorSpan = document.createElement('span')
    $errorSpan.classList.add('error-message')
    $errorSpan.textContent = message
    $formField.append($errorSpan)
}

const removeErrorMessage = $formField => {
    $formField.classList.remove('error')
    const error = $formField.querySelector('.error-message')
    const feedback = $formField.querySelector('.password-feedback')
    if (error) error.remove()
    if (feedback) feedback.remove()
}

// 서버에 중복체크 요청을 보내고 결과를 반환
const fetchToCheckDuplicate = async (type, value, $formField) => {
    const response = await fetch(`api/auth/check-duplicate?type=${type}&value=${value}`)
    const data = await response.json()
    if (!data.available) {
        showError($formField, data.message)
    }
}



// 이메일 또는 전화번호를 상세검증
const validateEmailOrPhone = async ($formField, inputValue) => {

    // 이메일 체크
    if (inputValue.includes('@')) {
        if (!ValidationRules.email.pattern.test(inputValue)) { // 패턴 체크
            showError($formField, ValidationRules.email.message)
        } else { // 서버에 통신해서 중복체크
            await fetchToCheckDuplicate('email', inputValue, $formField);

        }
    } else {
        // 전화번호 패턴 체크
        const numbers = inputValue.replace(/[^0-9]/g, '') // 숫자만 추출
        if (!ValidationRules.phone.pattern.test(numbers)) { // 패턴 체크
            showError($formField, ValidationRules.phone.message)
        } else { // 서버에 통신해서 중복체크
            await fetchToCheckDuplicate('phone', inputValue, $formField);
        }
    }
}

// 비밀번호 검증 (길이, 강도체크)
const validatePassword = ($formField, inputValue) => {
    // 길이 확인
    if (!ValidationRules.password.patterns.length.test(inputValue)) {
        showError($formField, ValidationRules.password.messages.length)
    }

    // 강도 체크
    const strength = checkPasswordStrength(inputValue)
    switch(strength) {
        case 'weak': // 에러로 처리
            showError($formField, ValidationRules.password.messages.weak)
            break;
        case 'medium': // 에러 아님
            showPasswordFeedback(
                $formField,
                ValidationRules.password.messages.medium,
                'warning'
            )
            break;
        case 'strong': // 에러 아님
            showPasswordFeedback(
                $formField,
                ValidationRules.password.messages.strong,
                'success'
            )
            break;
        default:
            break;
    }
}

const showPasswordFeedback = ($formField, message, type) => {
    const $feedback = document.createElement('span')
    $feedback.className = `password-feedback ${type}`
    $feedback.textContent = message
    $formField.append($feedback)
}

const validateUsername = async ($formField, inputValue) => {
    if (!ValidationRules.username.pattern.test(inputValue)) {
        showError($formField, ValidationRules.username.message)
    }
    await fetchToCheckDuplicate('username', inputValue, $formField);
}

// -------- 메인실행 코드 --------- //
document.addEventListener("DOMContentLoaded", initSignUp); // DOMContentLoaded 태그들이 다 렌더링 된 이후에 실행해라.