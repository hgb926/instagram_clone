import CarouselManager from "../ui/CarouselManager.js";


// 피드가 들어갈 전체 영역

const $feedContainer = document.querySelector('.feed-container')

// 피드의 날짜를 조작
const formatData = (dataString) => {
    // 날짜문자열을 날짜객체로 변환
    const date = new Date(dataString)

    // 현재 시간 구함
    const now = new Date();

    // 두 시간 사이 값을 구함
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return '방금 전'
    if (diff < 60 * 60) return `${Math.floor(diff / 60)}분 전`
    if (diff < 60 * 60 * 24) return `${Math.floor(diff / (60 * 60))}시간 전`
    if (diff < 60 * 60 * 24 * 7) return `${Math.floor(diff / (60 * 60 * 24))}일 전`

    return new Intl.DateTimeFormat(
        'ko', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }
    ).format(date)
}

const truncateContent = (writer, content, maxLength = 20) => {
    // 1. 먼저 텍스트 길이 체크
    if (content.length <= maxLength) {
        return `
            <a href="#" class="post-username">${writer}</a>
            <span class="post-caption">${content}</span>
        `
    }

    // 2. 긴 텍스트의 경우 처리
    const truncatedContent = content.substring(0, maxLength)

    return `
        <a href="#" class="post-username">${writer}</a>
        <span class="post-caption post-caption-truncated">
            <span class="truncated-text">${truncatedContent} ...</span>
            <span class="full-text" style="display: none">${content}</span>
        </span> 
        <button class="more-button">더 보기</button>
    `
}

// 한개의 피드를 렌더링하는 함수
function createFeedItem({writer, content, images, createdAt}) {


    return `
    <article class="post">
      <div class="post-header">
        <div class="post-user-info">
          <div class="post-profile-image">
            <img src="/images/default-profile.svg" alt="프로필 이미지">
          </div>
          <div class="post-user-details">
            <a href="#" class="post-username">
                <!--      작성자 이름 배치      -->
                ${writer}
            </a>
          </div>
        </div>
        <button class="post-options-btn">
          <i class="fa-solid fa-ellipsis"></i>
        </button>
      </div>
      <div class="post-images">
        <div class="carousel-container">
          <div class="carousel-track">
            <!--     이미지 목록 배치      -->
            ${images.map(img => {
        return `<img src="${img.imageUrl}" alt="feed image${img.imageOrder}"/>`
    }).join('')}
          </div>
          ${
        images.length > 1
            ? `
            <button class="carousel-prev">
              <i class="fa-solid fa-chevron-left"></i>
            </button>
            <button class="carousel-next">
              <i class="fa-solid fa-chevron-right"></i>
            </button>
            <div class="carousel-indicators">
                <!--        인디케이터 렌더링        -->
                ${images.map((_, i) =>
                `<span class="indicator ${i === 0 ? 'active' : ''}"></span>`
            ).join('')}
            </div>
          `
            : ''
    }
        </div>
      </div>
      
      <div class="post-actions">
        <div class="post-buttons">
          <div class="post-buttons-left">
            <button class="action-button like-button">
              <i class="fa-regular fa-heart"></i>
            </button>
            <button class="action-button comment-button">
              <i class="fa-regular fa-comment"></i>
            </button>
            <button class="action-button share-button">
              <i class="fa-regular fa-paper-plane"></i>
            </button>
          </div>
          <button class="action-button save-button">
            <i class="fa-regular fa-bookmark"></i>
          </button>
        </div>
        <div class="post-likes">
          좋아요 <span class="likes-count">0</span>개
        </div>
      </div>
      
      <div class="post-content">
        <div class="post-text">
            <!--     피드 내용     -->
            ${truncateContent(writer, content)}
        </div>
        <div class="post-time">
            <!--      피드 생성 시간      -->
            ${formatData(createdAt)}
        </div>
      </div>
      
      <div class="post-comments">
        <form class="comment-form">
          <input type="text" placeholder="댓글 달기..." class="comment-input">
          <button type="submit" class="comment-submit-btn" disabled>게시</button>
        </form>
      </div>
    </article>
  `;
}

// 피드를 서버로부터 불러오는 함수
const fetchFeeds = async () => {
    const response = await fetch('/api/posts')
    if (!response.ok) alert('피드 목록을 불러오는데 실패했습니다.')
    return await response.json()
}

// 피드 렌더링 함수
const renderFeed = async () => {
    // 피드 데이터를 서버로부터 불러오기
    const feedList = await fetchFeeds();

    // feed html 생성
    $feedContainer.innerHTML = feedList.map(feed => createFeedItem(feed)).join('');

    // 각 피드의 이미지 슬라이드에 각각 캐러셀 객체를 적용
    // 1. 피드의 모든 캐러셀 컨테이너를 가져옴
    const $carouselContainerList = [...document.querySelectorAll('.carousel-container')]

    // 2. 각각 캐러셀메니저를 걸어줌
    // 이미지가 2개 이상인 슬라이드만 캐러셀 생성

    $carouselContainerList.forEach(container => {

        const $images = [...container.querySelectorAll('.carousel-track img')]

        if ($images.length > 1) {
            const carousel = new CarouselManager(container);
            carousel.initWithImgTag($images)
        }
    })

    // 더 보기 버튼 이벤트 처리
    const $moreButtons = [...document.querySelectorAll('.more-button')]
    $moreButtons.forEach($btn => {

        $btn.addEventListener('click', e => {
            const $captionDiv = $btn.closest('.post-text')
            const $truncatedSpan = $captionDiv.querySelector('.truncated-text')
            const $fullSpan = $captionDiv.querySelector('.full-text')

            if ($truncatedSpan && $fullSpan) {
                $truncatedSpan.style.display = 'none'
                $fullSpan.style.display = 'inline'
            }
            $btn.style.display = 'none'
        })

    })

}


// 외부에 노출시킬 피드 관련 함수
const initFeed = () => {
    renderFeed();
}

export default initFeed;