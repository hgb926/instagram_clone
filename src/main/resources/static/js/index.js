/* src/main/resources/static/js/index.js */

import initStories from './components/stories.js';
import initCreateFeedModal from "./components/create-feed-modal.js";
import initFeed from './components/feed.js'

// 모든 태그가 렌더링되면 실행되는 이벤트 : DOMContentLoaded
// 이 함수가 실행되면 initStories가 실행됨
document.addEventListener('DOMContentLoaded', () => {
  initStories();
  initCreateFeedModal();
  initFeed()
});