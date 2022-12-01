async function checkPlaylist(url) {
    if (url.indexOf("playlist") === -1) {
        return "isntlistplay";
    } else {
        return "listplay";
    }
}

async function checkLink() {
	if (!document.querySelector('.URL-input').value) {
		alert("Veuillez indiquer un lien youtube !");
	} else {
		let url = document.querySelector('.URL-input').value;
		let playlist = await checkPlaylist(url);
		redirect(url, playlist);
	}
}

async function redirect(url, playlist) {
	front.send('here', app.getPath("music"), url, playlist);
}