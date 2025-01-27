
class CarouselManager {

    // JS는 Java처럼 필드를 선언하지 않고 생성자에서 필드 선언

    constructor(container) {
        // 캐러셀을 감싸는 부모 전체 태그를 생성자의 파라미터로 받아옴
        this.container = container;

        // 이미지 트랙(실제 이미지가 배치될 공간)
        this.track = this.container.querySelector('.carousel-track');

        // 인디케이터 영역
        this.indicatorContainer = this.container.querySelector('.carousel-indicators')

        // 실제 이미지 파일 배열
        this.slides = [];
    }

    // 기능 : 메서드. function 키워드를 안쓴다
    // 초기 이미지파일 배열 받기
    init(files) {
        this.slides= files;
        console.log(this.slides)
        // 슬라이드 띄우기
        this.setUpPreview()
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
            this.makeIndicator(index)
        })
    }

    makeIndicator(index) {
        const $indicator = document.createElement('span')
        $indicator.classList.add('indicator')
        if (index === 0) $indicator.classList.add('active')

        this.indicatorContainer.append($indicator)
    }
}

export default CarouselManager;