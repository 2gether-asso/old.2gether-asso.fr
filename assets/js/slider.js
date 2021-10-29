(() => {

	function init(sliderElement)
	{
		const slidesWrapper = sliderElement.querySelector('.slides')
		const slideElements = Array.from(slidesWrapper.querySelectorAll('[data-slide-id]'))

		// Initialize the slider state
		let isDragging = false
		let startPos = 0
		let currentTranslate = 0
		let prevTranslate = 0
		let animationID
		let currentIndex = 0
		let prevIndex = 0

		// Initialize the slider
		currentIndex = Math.floor(Math.random() * slideElements.length)
		setPositionByIndex()

		// Create event listeners on slides
		slideElements.forEach(slide => {
			// disable default image drag
			Array.from(slide.querySelectorAll('img'))
				.forEach(e => e.addEventListener('dragstart', e => e.preventDefault()))

			// Touch events
			slide.addEventListener('touchstart', touchStart)
			slide.addEventListener('touchend', touchEnd)
			slide.addEventListener('touchmove', touchMove)

			// Mouse events
			slide.addEventListener('mousedown', touchStart)
			slide.addEventListener('mouseup', touchEnd)
			slide.addEventListener('mousemove', touchMove)
			slide.addEventListener('mouseleave', touchEnd)
		})

		// Create event listeners on controls
		const controlElement = sliderElement.querySelector('.control')
		const prevElement = controlElement.querySelector('.prev')
		const nextElement = controlElement.querySelector('.next')
		const dotElements = Array.from(controlElement.querySelectorAll('[data-slide-set]'))

		prevElement.addEventListener('click', event => {
			event.preventDefault()

			currentIndex -= 1
			setPositionByIndex()
		})

		nextElement.addEventListener('click', event => {
			event.preventDefault()

			currentIndex += 1
			setPositionByIndex()
		})

		dotElements.forEach((dotElement, index) => {
			dotElement.addEventListener('click', event => {
				event.preventDefault()

				const dataSlideSet = e.target.getAttribute('data-slide-set')
				currentIndex = dataSlideSet !== null ? parseInt(dataSlideSet) - 1 : index
				setPositionByIndex()
			})
		})

		// Fix position on window resize
		window.addEventListener('resize', setPositionByIndex)

		function getPositionX(event)
		{
			return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX
		}

		// use a HOF so we have index in a closure
		function touchStart(event)
		{
			startPos = getPositionX(event)
			isDragging = true
			animationID = requestAnimationFrame(animation)
			slidesWrapper.classList.add('touch')
		}

		function touchMove(event)
		{
			if (isDragging) {
				const currentPosition = getPositionX(event)
				currentTranslate = prevTranslate + currentPosition - startPos
			}
		}

		function touchEnd()
		{
			cancelAnimationFrame(animationID)
			isDragging = false
			const movedBy = currentTranslate - prevTranslate

			if (movedBy < -100 && currentIndex < slideElements.length - 1) currentIndex += 1
			if (movedBy > 100 && currentIndex > 0) currentIndex -= 1
			setPositionByIndex()

			slidesWrapper.classList.remove('touch')
		}

		function animation()
		{
			setSliderPosition()
			if (isDragging)
				requestAnimationFrame(animation)
		}

		function setPositionByIndex()
		{
			if (currentIndex < 0)
				currentIndex = slideElements.length - 1
			else if (currentIndex > slideElements.length - 1)
				currentIndex = 0

			const slideElementWidth = slideElements[0].offsetWidth
			currentTranslate = currentIndex * -slideElementWidth + (slidesWrapper.offsetWidth - slideElementWidth) / 2
			// if (currentTranslate > 0) currentTranslate = 0
			prevTranslate = currentTranslate

			prevIndex = currentIndex

			sliderElement.querySelectorAll('.active')
				.forEach(e => e.classList.remove('active'))

			Array.from(sliderElement.querySelectorAll('[data-slide-set="' + (currentIndex + 1) + '"]'))
				.forEach(dot => {
					dot.classList.add('active')
				});

			setSliderPosition()
		}

		function setSliderPosition()
		{
			slidesWrapper.style.transform = `translateX(${currentTranslate}px)`
		}
	}

	Array.from(document.querySelectorAll('[data-slider]'))
		.forEach(e => init(e))

})();
