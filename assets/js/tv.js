(() => {
	
	new Twitch.Embed("alivestream", {
		width: '100%',
		height: 480,
		channel: "helldwin",
	});
	
	const embed = document.querySelector('#alivestream iframe');
	const resizeTwitchEmbed = () => {
		console.log("bork");
		if (!embed) return;
		if (embed.offsetWidth > 680)
			embed.height = ((embed.offsetWidth - 340) / 16) * 9;
		else
			embed.height = (embed.offsetWidth / 16) * 18;
		console.log("owo", embed.height);
	};
	window.addEventListener('resize', resizeTwitchEmbed);
	embed.onload = resizeTwitchEmbed;

})();