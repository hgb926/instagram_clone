class HashtagSearch {

    constructor($textarea) {

        // 사용자가 피드내용을 입력하는 영역
        this.$textarea = $textarea

        this.$suggestionContainer = this.createContainer();

        // 디바운스를 위한 타이머변수
        this.searchTimeout = null;
    }

    // textarea에 input이벤트 걸기
    init() {
        // 텍스트 입력 감지
        this.$textarea.addEventListener('input', e => {
            const text = e.target.value;

            // 해시태그 입력을 감지해야 함.
            const currentCursorPosition = e.target.selectionStart // 현재 커서 위치

            const hashtagMatch = this.findHashtagAtCursor(text, currentCursorPosition);

            if (hashtagMatch && hashtagMatch.keyword !== '') {
                // 서버에 검색요청 보내기 - 디바운스 적용
                clearTimeout(this.searchTimeout);

                const searchTimeout = setTimeout(() => {
                    this.fetchHashtagSearch(hashtagMatch.keyword)
                }, 700);
            }
        })
    }

    async fetchHashtagSearch(keyword) {

        if (!keyword) return

        const response = await fetch(`/api/hashtags/search?keyword=${keyword}`)
        const hashtags = await response.json();

        // 서버에서 가져온 해시태그정보 렌더링
        this.renderSuggestions(hashtags)
    }

    // 서버에서 가져온 해시태그 화면에 렌더링하기
    renderSuggestions(hashtags) {

        // 검색결과가 없다면 컨테이너 숨기기
        if (!hashtags || !hashtags.length) {
            this.hideSuggestions();
            return;
        }

        // HTML 문자열로 각 해시태그 아이템을 구성하여 삽입
        this.$suggestionContainer.innerHTML = hashtags
            .map(
                (tag, index) => `
      <div class="hashtag-item" data-name="${tag.hashtag}" data-index="${index}">
        <div class="hashtag-info">
          <span class="hashtag-name">#${tag.hashtag}</span>
          <span class="post-count">게시물 ${tag.feedCount}개</span>
        </div>
      </div>
    `
            )
            .join('');

        // 생성된 목록을 보여주기
        this.$suggestionContainer.style.display = 'block';

        // 해시태그 클릭시 이벤트
        // this.addClickEvents();

    }

    // 해시태그 추천 컨테이너 숨기기
    hideSuggestions() {
        this.$suggestionContainer.style.display = 'none';
    }


    // 해시태그 입력 감지
    /**
     * 현재 커서 앞부분에 있는 가까운 해시태그를 찾는다.
     * @param {string} text - 전체 textarea 입력값
     * @param {*} currentCursorPosition - 현재 위치한 커서의 인덱스
     */
    findHashtagAtCursor(text, currentCursorPosition) {
        // 현재 위치한 커서 이전에 있는 텍스트를 전부 추출
        const beforeCursorText = text.substring(0, currentCursorPosition);

        // 정규표현식으로 마지막 해시태그를 찾아내서 추출
        const match = beforeCursorText.match(/#[\w가-힣]*$/);

        return match ? {keyword: match[0].substring(1)} : null;
    }

    // 해시태그 추천 목록을 만들 컨테이너
    createContainer() {
        const $container = document.createElement('div')
        $container.classList.add('hashtag-suggestions')
        this.$textarea.parentElement.append($container)
        return $container;
    }


}

export default HashtagSearch;