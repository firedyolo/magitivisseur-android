const back = require('androidjs').back;
const fs = require("fs");
const ytdl = require("ytdl-core");
const ytpl = require("ytpl");

back.on("here", async function(folder, url, playlist) {
	let titleOfPlaylist = [];

	if(!ytdl.validateURL(url) && !ytpl.validateID(url)) {
        return back.send("urlError", `L'url n'est pas valide !`);
    }

	async function getTitle(url) {
        let infos = await ytdl.getBasicInfo(url);
        return infos.videoDetails.title.replace(/[^\w\s]/g, '');
    }

	async function download(url) {
        let title = await getTitle(url);
        let writer = fs.createWriteStream(`./${folder}/${title}.mp3`);
        
		ytdl(url, {
			format: 'mp3',
			filter: 'audioonly',
		}).pipe(writer);

        writer.on("finish", () => {
            back.send("downloadInfo", `Le téléchargement de ${title} est fini !`);
        })
    }

    async function downloadPlaylist(url, title, playlistTitle, numberOfSongs, downloadedSongs) {
        let writer = fs.createWriteStream(`./${folder}/${title}.mp3`);
    
        ytdl(url, {
            format: 'mp3',
            filter: 'audioonly',
        }).pipe(writer);
    
        writer.on("finish", () => {
            back.send("downloadInfo", `Playlist ${playlistTitle} -> Le téléchargement de ${title} est fini ! (${downloadedSongs}/${numberOfSongs})`);
        });
    }

	async function getPlaylistInfos(url) {
        let infos = await ytpl(url, {pages: Infinity});
        let numberOfSongs = infos.estimatedItemCount;
        let playlistTitle = infos.title;
    
        for (const video of infos.items) {
            titleOfPlaylist.push(video.id);
        }
    
        return {titleOfPlaylist: playlistTitle, numberOfSongs: numberOfSongs};
    }

    //Exécution de la playlist ou pas
    if (playlist === "listplay") {
        let playlistInfos = await getPlaylistInfos(url);
        let downloadedSongs = 0;
        for (const videoID of titleOfPlaylist) {
            let title = await getTitle(videoID);
            downloadedSongs++;
            downloadPlaylist(videoID, title, playlistInfos.titleOfPlaylist, playlistInfos.numberOfSongs, downloadedSongs);
        } 
    } else {
        download(url);
    }
});