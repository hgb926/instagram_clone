
class CarouselManager {

    // JS는 Java처럼 필드를 선언하지 않고 생성자에서 필드 선언

    constructor(container) {

        // 캐러셀을 감싸는 부모 전체 태그를 생성자의 파라미터로 받아옴
        this.container = container;

        // 실제 이미지 파일 배열
        this.slides = [];

        // 현재 인덱스
        this.currentIndex = 0

        // 이미지 트랙(실제 이미지가 배치될 공간)
        this.track = this.container.querySelector('.carousel-track');

        // 인디케이터 영역
        this.indicatorContainer = this.container.querySelector('.carousel-indicators')

        // 이전, 다음 슬라이드 버튼
        this.prevBtn = this.container.querySelector('.carousel-prev')
        this.nextBtn = this.container.querySelector('.carousel-next')


        // 이벤트 바인딩
        this.prevBtn.addEventListener('click', e => {
            this.goToSlide(this.currentIndex - 1)
        })
        this.nextBtn.addEventListener('click', e => {
            this.goToSlide(this.currentIndex + 1)
        })
    }

    // 기능 : 메서드. function 키워드를 안쓴다
    // 초기 이미지파일 배열 받기
    init(files) {
        this.slides= files;
        console.log(this.slides)
        // 슬라이드 띄우기
        this.setUpPreview()
    }

    // 이미지 파일 대신 이미지태그를 받아 이벤트처리만 수행하는 함수
    initWithImgTag($images) {
        this.slides = $images
        this.goToSlide(0)
    }


    setUpPreview() {

        // 이미지 트랙 리셋
        this.track.innerHtml = '';

        this.slides.forEach((file, index) => {
            // 이미지 생성
            const $img = document.createElement('img')
            // raw 파일을 image url로 변환 (썸네일처리)
            $img.src = URL.createObjectURL(file)

            // 이미지를 감쌀 박스 생성
            const $slideDiv = document.createElement('div')
            $slideDiv.classList.add('carousel-slide')
            $slideDiv.append($img)

            this.track.append($slideDiv)

            // 인디케이터 생성
            if (this.slides.length > 1) this.makeIndicator(index)
        })
    }

    makeIndicator(index) {
        const $indicator = document.createElement('span')
        $indicator.classList.add('indicator')
        if (index === 0) $indicator.classList.add('active')

        this.indicatorContainer.append($indicator)
    }

    // 슬라이드 x축 이동함수
    goToSlide(index) {

        if (index < 0 || index > this.slides.length - 1) return

        // 현재 인덱스 갱신
        this.currentIndex = index
        // 트랙 이동
        this.track.style.transform = `translateX(-${index * 100}%)`

        // 이전, 다음 슬라이드 버튼 활성화 여부
        this.prevBtn.style.display = !index ? 'none' : 'flex'
        this.nextBtn.style.display = index === this.slides.length - 1 ? 'none' : 'flex'

        // 인디케이터 변화 업데이트
        const $indicators = [...this.indicatorContainer.children]

        $indicators.forEach(($ind, idx) => {
            $ind.classList.toggle('active', idx === index)
        })
    }
}

export default CarouselManager;