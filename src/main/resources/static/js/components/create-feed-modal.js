// 피드 생성 모달 전역관리
let $modal = null;


function initCreateFeedModal() {
    $modal = document.getElementById("createPostModal");

    // 모달 열기
    const openModal = (e) => {
        e.preventDefault()
        $modal.style.display = 'flex'
    }

    // 피드 생성 모달 열기 이벤트
    document.querySelector('.fa-square-plus')
        .closest('.menu-item')
        .addEventListener('click', openModal)
}

export default initCreateFeedModal;