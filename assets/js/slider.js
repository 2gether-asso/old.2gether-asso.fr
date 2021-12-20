(() => {

	function init(sliderElement)
	{
		const slidesWrapperSelector = sliderElement.querySelector('.slides')
		if (!slidesWrapperSelector)
			return

		const slidesWrapper = slidesWrapperSelector // as HTMLElement
		const slideElements = Array.from(slidesWrapper.querySelectorAll('[data-slide-id]')) // as HTMLElement[]

		// Initialize the slider state
		let isDragging = false
		let startPos = 0
		let currentTranslate = 0
		let prevTranslate = 0
		let animationID = -1
		let currentIndex = -1

		// Initialize the slider
		slideElements.some((slide, index) => {
			// Initialize the slider current index
			if (slide.getAttribute('data-slide-active') !== null)
			{
				currentIndex = index
				return true
			}
			return false
		})
		if (currentIndex < 0) {
			currentIndex = Math.floor(Math.random() * slideElements.length)
		}
		setPositionByIndex()

		// Create event listeners on slides
		slideElements.forEach(slide =>
			{
				// disable default image drag
				Array.from(slide.querySelectorAll('img'))
					.forEach(e => e.addEventListener('dragstart', e => e.preventDefault()))

				const boundTouchStart = touchStart.bind(slide)
				const boundTouchMove = touchMove.bind(slide)
				const boundTouchEnd = touchEnd.bind(slide)

				// Touch events
				slide.addEventListener('touchstart', boundTouchStart)
				slide.addEventListener('touchend', boundTouchEnd)
				slide.addEventListener('touchmove', boundTouchMove)

				// Mouse events
				slide.addEventListener('mousedown', boundTouchStart)
				slide.addEventListener('mouseup', boundTouchEnd)
				slide.addEventListener('mousemove', boundTouchMove)
				slide.addEventListener('mouseleave', boundTouchEnd)
			})

		// Fix position on window resize
		window.addEventListener('resize', setPositionByIndex)

		function getPositionX(event) // (event: any)
		{
			return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX
		}

		function touchStart(event) // (this: HTMLElement, event: any)
		{
			startPos = getPositionX(event)
			isDragging = true
			animationID = requestAnimationFrame(animation)
			slidesWrapper.classList.add('touch')
		}

		function touchMove(event) // (this: HTMLElement, event: any)
		{
			if (isDragging) {
				const currentPosition = getPositionX(event)
				currentTranslate = prevTranslate + currentPosition - startPos
			}
		}

		function touchEnd() // (this: HTMLElement, event: any)
		{
			cancelAnimationFrame(animationID)

			if (isDragging)
			{
				const movedBy = currentTranslate - prevTranslate
				if (movedBy < -100 && currentIndex < slideElements.length - 1)
				{
					currentIndex += 1
				}
				else if (movedBy > 100 && currentIndex > 0)
				{
					currentIndex -= 1
				}
				else if (movedBy === 0)
				{
					// Simple click
					const slideId = this.getAttribute('data-slide-id')
					if (slideId) {
						const thisIndex = parseInt(slideId) - 1
						if (currentIndex !== thisIndex)
						{
							currentIndex = thisIndex
						}
						else
						{
							// Open modal
							document.querySelectorAll('.modal')
								.forEach(modal => modal.classList.remove('active'))
							document.querySelectorAll('.modal[data-modal-id="' + slideId + '"]')
								.forEach(modal => modal.classList.add('active'))
						}
					}
				}
				setPositionByIndex()
			}

			isDragging = false
			slidesWrapper.classList.remove('touch')
		}

		function animation()
		{
			setSliderPosition()

			if (isDragging)
			{
				requestAnimationFrame(animation)
			}
		}

		function setPositionByIndex()
		{
			if (currentIndex < 0)
			{
				currentIndex = slideElements.length - 1
			}
			else if (currentIndex > slideElements.length - 1)
			{
				currentIndex = 0
			}

			const slideElementWidth = slideElements[0].offsetWidth
			currentTranslate = currentIndex * -slideElementWidth + (slidesWrapper.offsetWidth - slideElementWidth) / 2
			prevTranslate = currentTranslate

			sliderElement.querySelectorAll('.active')
				.forEach(element => element.classList.remove('active'))

			const slideId = currentIndex + 1
			sliderElement.querySelectorAll('[data-slide-id="' + (slideId) + '"], [data-slide-set="' + (slideId) + '"]')
				.forEach(element => element.classList.add('active'))

			setSliderPosition()
		}

		function setSliderPosition()
		{
			slidesWrapper.style.transform = `translateX(${currentTranslate}px)`
		}
	}

	document.querySelectorAll('[data-slider]')
		.forEach(element => init(element))

})();
