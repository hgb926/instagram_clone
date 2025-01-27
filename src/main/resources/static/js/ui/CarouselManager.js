
class CarouselManager {

    // JS는 Java처럼 필드를 선언하지 않고 생성자에서 필드 선언

    constructor(container) {
        // 캐러셀을 감싸는 부모 전체 태그를 생성자의 파라미터로 받아옴
        this.container = container;

        // 이미지 트랙(실제 이미지가 배치될 공간)
        this.track = this.container.querySelector('.carousel-track');

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
        this.slides.forEach(file => {
            // 이미지 생성
            const $img = document.createElement('img')
            // raw 파일을 image url로 변환 (썸네일처리)
            $img.src = URL.createObjectURL(file)

            // 이미지를 감쌀 박스 생성
            const $slideDiv = document.createElement('div')
            $slideDiv.classList.add('carousel-slide')
            $slideDiv.append($img)

            this.track.append($slideDiv)
        })
    }

}

export default CarouselManager;