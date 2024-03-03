function Carousel() {
}

Carousel.prototype = {
	_initProps() {
		this.container = document.querySelector('#carousel')
		this.slides = this.container.querySelectorAll('.slide')
		this.indicatorsContainer = this.container.querySelector('#indicators-container')
		this.indicatorItems = this.indicatorsContainer.querySelectorAll('.indicator')
		this.pauseBtn = this.container.querySelector('#pause-btn')
		this.prevBtn = this.container.querySelector('#prev-btn')
		this.nextBtn = this.container.querySelector('#next-btn')
		
		this.SLIDES_COUNT = this.slides.length
		this.CODE_ARROW_LEFT = 'ArrowLeft'
		this.CODE_ARROW_RIGHT = 'ArrowRight'
		this.CODE_SPACE = 'Space'
		
		this.currentSlide = 0
		this.timerId = null
		this.isPlaying = true
		this.startPosX = null
		this.endPosX = null
		this.interval = 2000
	},
	
	_initListeners() {
		this.pauseBtn.addEventListener('click', this.pausePlay.bind(this))
		this.prevBtn.addEventListener('click', this.prev.bind(this))
		this.nextBtn.addEventListener('click', this.next.bind(this))
		this.indicatorsContainer.addEventListener('click', this._indicateHandler.bind(this))
		this.container.addEventListener('touchstart', this._swipeStart.bind(this))
		this.container.addEventListener('mousedown', this._swipeStart.bind(this))
		this.container.addEventListener('touchend', this._swipeEnd.bind(this))
		this.container.addEventListener('mouseup', this._swipeEnd.bind(this))
		document.addEventListener('keydown', this._pressKey.bind(this))
	},
	
	_gotoNth(n) {
		this.slides[this.currentSlide].classList.toggle('active')
		this.indicatorItems[this.currentSlide].classList.toggle('active')
		this.currentSlide = (n + this.SLIDES_COUNT) % this.SLIDES_COUNT
		this.slides[this.currentSlide].classList.toggle('active')
		this.indicatorItems[this.currentSlide].classList.toggle('active')
	},
	
	_gotoPrev() {
		this._gotoNth(this.currentSlide - 1)
	},
	
	_gotoNext() {
		this._gotoNth(this.currentSlide + 1)
	},
	
	_tick() {
		this.timerId = setInterval(() => this._gotoNext(), this.interval)
	},
	
	_indicateHandler(e) {
		const {target} = e
		if (target && target.classList.contains('indicator')) {
			this.pause()
			this._gotoNth(+target.dataset.slideTo)
		}
	},
	
	_pressKey(e) {
		const {code} = e
		e.preventDefault()
		if (code === this.CODE_SPACE) this.pausePlay()
		if (code === this.CODE_ARROW_LEFT) this.prev()
		if (code === this.CODE_ARROW_RIGHT) this.next()
	},
	
	_swipeStart(e) {
		this.startPosX = e instanceof MouseEvent
				? e.pageX // MouseEvent
				: e.changedTouches[0].pageX // TouchEvent
	},
	
	_swipeEnd(e) {
		this.endPosX = e instanceof MouseEvent
				? e.pageX // MouseEvent
				: this.endPosX = e.changedTouches[0].pageX // TouchEvent
		
		if (this.endPosX - this.startPosX > 100) this.prev()
		if (this.endPosX - this.startPosX < -100) this.next()
	},
	
	pause() {
		if (!this.isPlaying) return
		clearInterval(this.timerId)
		this.pauseBtn.innerHTML = 'Play'
		this.isPlaying = false
	},
	
	play() {
		this._tick()
		this.pauseBtn.innerHTML = 'Pause'
		this.isPlaying = true
	},
	
	pausePlay() {
		this.isPlaying ? this.pause() : this.play()
	},
	
	prev() {
		this.pause()
		this._gotoPrev()
	},
	
	next() {
		this.pause()
		this._gotoNext()
	},
	
	init() {
		this._initProps()
		this._initListeners()
		this._tick()
	},
}

const carousel = new Carousel()

carousel.init()