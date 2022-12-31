async function checkPlaylist(url) {
    if (url.indexOf("playlist") === -1) {
        return "isntplaylist";
    } else {
        return "playlist";
    }
}

async function checkLink(format) {
	if (!document.querySelector('.URL-input').value) {
		alert("Veuillez indiquer un lien youtube !");
	} else {
		let url = document.querySelector('.URL-input').value;
		let playlist = await checkPlaylist(url);
		redirect(url, playlist, format);
	}
}

async function redirect(url, playlist, format) {
	if (format === "mp3") {
		front.send('here', app.getPath("music"), url, format, playlist);
	} else {
		front.send("here", app.getPath("movies"), url, format, playlist);
	}
}