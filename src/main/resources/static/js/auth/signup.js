

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
    $form.addEventListener('submit', e => {
        e.preventDefault() // 폼 전송시 발생하는 새로고침 방지
        // 사용자가 입력한 모든 입력값 읽어오기
        const emailOrPhone = document.querySelector('input[name="email"]').value;
        const name = document.querySelector('input[name="name"]').value;
        const username = document.querySelector('input[name="username"]').value;
        const password = document.querySelector('input[name="password"]').value;

        const payload = {
            emailOrPhone,
            name,
            username,
            password
        }
        if (payload) {
            fetchToSignUp(payload)
        }

    })
}

// -------- 메인실행 코드 --------- //
document.addEventListener("DOMContentLoaded", initSignUp); // DOMContentLoaded 태그들이 다 렌더링 된 이후에 실행해라.