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
	//const res = await fetch(`${serverURL}/download?url=${url}&fetch=fetch`);
	front.send('here', app.getPath("music"), url, playlist);
	/*if (res.status === 200) {
		window.location.href = `${serverURL}/download?url=${url}&fetch=dwnld&islistplay=${playlist}`;
	} else if (res.status === 400) {
		alert("Le lien n'est pas bon Kévin !");
	} else {
		alert(`Vous avez possiblement un soucis de connexion. Erreur : ${res.status}`);
	}*/
}