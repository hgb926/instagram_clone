
import CarouselManager from "../ui/CarouselManager.js";

// step 모듈 내에서 전역관리
let currentStep = 1;

// 캐러셀 전역 변수
let step2Carousel;
let step3Carousel

// 피드 생성 모달 전역관리
let $modal = document.getElementById("createPostModal");

// 모달 관련 DOM들을 저장할 객체
let elements = {
    $closeBtn: $modal.querySelector('.modal-close-button'),
    $backdrop: $modal.querySelector('.modal-backdrop'),
    $uploadBtn: $modal.querySelector('.upload-button'),
    $fileInput: $modal.querySelector('#fileInput'),
    $backStepBtn: $modal.querySelector('.back-button'),
    $nextStepBtn: $modal.querySelector('.next-button'),
    $modalTitle: $modal.querySelector('.modal-title'),
}

// 모달 바디 스텝을 이동하는 함수
const goToStep = step => {

    if (step < 1 || step > 3) return;

    currentStep = step

    const {$backStepBtn, $nextStepBtn, $modalTitle, $fileInput} = elements;

    // 기존 스텝 컨테이너의 active를 제거하고 해당 step 컨테이너에 active 부여
    [...$modal.querySelectorAll('.step')].forEach(($stepContainer, index) => {
        $stepContainer.classList.toggle('active', step === index + 1)
    })

    // 각 스텝별 버튼 활성화/비활성화 처리
    if (step === 1) {
        $fileInput.value = '' // 취소 후 change이벤트 발동을 위한 리셋
        $nextStepBtn.style.display = 'none'
        $backStepBtn.style.display = 'hidden'
        $modalTitle.textContent = '새 게시물 만들기'
    } else if (step === 2) {
        $nextStepBtn.style.display = 'block'
        $backStepBtn.style.visibility = 'visible'
        $modalTitle.textContent = '편집'
        $nextStepBtn.textContent = '다음'
    } else if (step === 3) {
        $nextStepBtn.textContent = '공유하기'
        $modalTitle.textContent = '새 게시물 만들기'
    }
}


// 파일 업로드 관련 이벤트 함수
const setUpFileUploadEvents = () => {
    const {$uploadBtn, $fileInput} = elements;

    // 파일을 검사하고 다음 단계로 이동하는 함수
    const handleFiles = files => {
        // 파일의 개수가 10개가 넘는지 검사
        if (files.length > 10) {
            alert('최대 10개의 파일만 선택 가능합니다.')
            return
        }
        // 파일이 이미지인지 확인
        const validFiles = files.filter(file => {

            //     if (!file.type.startsWith('image')) {
            //         alert(`${file.name}은(는) 이미지가 아닙니다.`)
            //         return false
            //     }
            //     return true
            // }).filter(file => {
            if (file.size > 10 * 1024 * 1024) {
                alert(`${file.name}은(는) 10MB를 초과합니다.`)
                return false
            }
            return true
        })

        // 이미지 슬라이드 생성
        step2Carousel = new CarouselManager($modal.querySelector('.preview-container'));
        step2Carousel.init(validFiles); // 필터링된 이미지파일 전달

        step3Carousel = new CarouselManager($modal.querySelector('.write-container'));
        step3Carousel.init(validFiles); // 필터링된 이미지파일 전달

        goToStep(2)

    }

    // 업로드 버튼을 누르면 파일선택창이 대신 눌리도록 조작
    $uploadBtn.addEventListener('click', e => {
        e.preventDefault();
        $fileInput.click()
    })

    // 파일 선택이 끝났을 때 파일정보를 읽는 이벤트
    $fileInput.addEventListener('change', e => {
        const files = Array.from(e.target.files) // 유사배열 -> 배열 변환
        if (files.length > 0) handleFiles(files);
    })
}

// 피드 생성 모달 관련 이벤트 함수
const setUpModalEvents = () => {

    const {$closeBtn, $backdrop, $backStepBtn, $nextStepBtn} = elements;

    // 모달 열기
    const openModal = (e) => {
        e.preventDefault()
        $modal.style.display = 'flex'
        document.body.style.overflow = 'hidden'; // 배경 body 스크롤 방지 코드
    }

    // 모달 닫기
    const closeModal = e => {
        e.preventDefault()
        $modal.style.display = 'none'
        document.body.style.overflow = 'auth'; // 배경 body 스크롤 방지 해제
    }

    // 피드 생성 모달 열기 이벤트
    document
        .querySelector('.fa-square-plus')
        .closest('.menu-item')
        .addEventListener('click', openModal)

    // x버튼 눌렀을 때
    $closeBtn.addEventListener('click', closeModal)
    // 백드롭 눌렀을 때
    $backdrop.addEventListener('click', closeModal)

    // 모달 이전, 다음 스텝 클릭 이벤트
    $backStepBtn.addEventListener('click', () => goToStep(currentStep - 1))
    $nextStepBtn.addEventListener('click', () => {
        if (currentStep < 3) {
            goToStep(currentStep + 1)
        } else {
            alert('서버로 게시물을 공유합니다.')
        }
    })
}

// 이벤트 바인딩 관련 함수
const bindEvent = () => {
    setUpModalEvents()
    setUpFileUploadEvents()
}


function initCreateFeedModal() {
    bindEvent()
}

export default initCreateFeedModal;