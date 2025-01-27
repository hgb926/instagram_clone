

// 피드 생성 모달 전역관리
let $modal = document.getElementById("createPostModal");

// 모달 관련 DOM들을 저장할 객체
let elements = {
    $closeBtn: $modal.querySelector('.modal-close-button'),
    $backdrop: $modal.querySelector('.modal-backdrop'),
}

// 피드 생성 모달 관련 이벤트 함수
const setUpModalEvents = () => {

    const { $closeBtn, $backdrop } = elements;

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
}

// 이벤트 바인딩 관련 함수
const bindEvent = () => {
    setUpModalEvents()
}


function initCreateFeedModal() {
    bindEvent()
}

export default initCreateFeedModal;