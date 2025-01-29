

// 한개의 피드를 렌더링하는 함수
const createFeedItem = (item) => {

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
    console.log(feedList)

    // feed html 생성
    const feedhtml = createFeedItem(feedList[0])
}


// 외부에 노출시킬 피드 관련 함수
const initFeed = () => {
    renderFeed();
}

export default initFeed;