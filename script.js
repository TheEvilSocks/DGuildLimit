const redirectUrl = `https://discordapp.com/api/oauth2/authorize?response_type=token&client_id=679783114435854346&scope=guilds&redirect_uri=${encodeURIComponent(location.href.substring(0, location.href.indexOf("#") > -1 ? location.href.indexOf("#") : undefined))}`;
var state = 0;
var checkClosedInterval;

const getGuilds = async (userType, token) => {
	const response = await fetch('https://discordapp.com/api/v6/users/@me/guilds', {
		headers: {
			"Authorization": `${userType} ${token}`
		}
	});
	return response.json();
}

if (window.opener) {
	window.opener.countGuilds(location.hash);
	window.close();
}



if (location.hash === "") {

	var newWin = window.open(redirectUrl, "GuildLimitWindow", "menubar=no,toolbar=no,location=yes,personalbar=no,dependent=yes,minimizable=no,scrollbars=no,dialog=yes,width=480,height=780");
	state = 1;
	if (!newWin || newWin.closed || typeof newWin.closed == 'undefined') {
		location = redirectUrl;
		document.write(`<meta http-equiv="Refresh" content="0; url=${redirectUrl}"">`);
	} else {
		document.getElementById("result").innerHTML = "Waiting for authorization...";
		checkClosedInterval = setInterval(() => {
			if (state != 1)
				clearInterval(checkClosedInterval);
			if (state == 1 && (!newWin || newWin.closed || typeof newWin.closed == 'undefined')) {
				state = 3;
				document.getElementById("result").innerHTML = "Authorization failed";
				clearInterval(checkClosedInterval);
			}
		}, 100);
	}
} else {
	countGuilds(location.hash);
}

function countGuilds(hash) {
	state = 2;
	history.replaceState(null, "Discord Guild Limit Checker", "#");

	let userType = new RegExp("token_type=(.+?)&").exec(hash)[1];
	let token = new RegExp("access_token=(.+?)&").exec(hash)[1];

	document.getElementById("result").innerHTML = "Fetching data...";

	getGuilds(userType, token).then(response => {
		document.getElementById("result").innerHTML = `You are in ${response.length}/100 guilds!`;
	});
}