(() => {

const $body = document.querySelector('body');
// const $live = document.querySelector('#live');
const $countdown = document.querySelector('#countdown');
// const $title = $countdown.querySelector('#countdown-title');
const $field = $countdown.querySelector('#countdown-field');
const $display = $countdown.querySelector('#countdown-display');

const targetTime = $countdown.getAttribute('data-target-time');
const targetDate = new Date(targetTime);
// const targetDate = new Date();
// targetDate.setSeconds(targetDate.getSeconds() + 0);

const currentDate = new Date();
const diffSeconds = (targetDate - currentDate) / 1000;
	console.log(diffSeconds);

if (diffSeconds >= 1) {
	$display.classList.add('d-none');
}

const update = () => {
	const currentDate = new Date();
	const diffSeconds = (targetDate - currentDate) / 1000;
	console.log(diffSeconds);
	
	const seconds = ('0' + Math.floor(diffSeconds % 60)).slice(-2);
	const minutes = ('0' + Math.floor(diffSeconds % 3600 / 60)).slice(-2);
	const hours = ('0' + Math.floor(diffSeconds % (3600 * 24) / 3600)).slice(-2);
	const days = Math.floor(diffSeconds / (3600 * 24));
	
	let html = '';
	let addSpace = false;
	if (days > 0) html += `${days}j ${hours}h ${minutes}m ${seconds}s`;
	else if (hours > 0) html += `${hours}h ${minutes}m ${seconds}s`;
	else if (minutes > 0) html += `${minutes}m ${seconds}s`;
	else if (seconds > 0) html += `${seconds}s`;
	else html += `C'est maintenant !`;
	
	$field.innerHTML = html;
	
	if (diffSeconds >= 1) {
		if (diffSeconds < parseInt($display.getAttribute('data-delta-time')))
			$display.classList.remove('d-none');
		
		// Timer updates every second
		setTimeout(update, 1000);
	}
	else {
		$display.classList.remove('d-none');
		$field.classList.add('d-none');
		
		// Reloads the page after 20 seconds
		setTimeout(() => {
			location.reload();
		}, 20000);
	}
};
update();

})();
