import { ValidationRules, checkPasswordStrength } from "./validation.js";


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

    const handleInput = ($input) => {
        removeErrorMessage($input.closest('.form-field'))
        validateField($input) // 입력값 검증 함수 호출
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

    // 1. 빈 값 체크
    // 이게 어떤태그인지 알아오기
    const fieldName = $input.name
    // 입력값 읽어오기
    const inputValue = $input.value
    // input의 부모 가져오기
    const $formField = $input.closest('.form-field')

    if (!inputValue) { // 값이 비어있을때
        showError($formField, ValidationRules[fieldName]?.requiredMessage); // 에러메시지 렌더링
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
    if (error) error.remove()
}

// -------- 메인실행 코드 --------- //
document.addEventListener("DOMContentLoaded", initSignUp); // DOMContentLoaded 태그들이 다 렌더링 된 이후에 실행해라.