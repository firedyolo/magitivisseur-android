const back = require('androidjs').back;
const fs = require("fs");
const ytdl = require("ytdl-core");
const ytpl = require("ytpl");
const cp = require("child_process");
const ffmpeg = require('ffmpeg-static');

back.on("here", async function(folder, url, format, playlist) {
	let titleOfPlaylist = [];

	if(!ytdl.validateURL(url) && !ytpl.validateID(url)) {
        return back.send("urlError", `L'url n'est pas valide !`);
    }

    // Fonctions "universelles"
	async function getTitle(url) {
        let infos = await ytdl.getBasicInfo(url);
        return infos.videoDetails.title.replace(/[^\w\s]/g, '');
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

    //Partie MP3
	async function downloadMP3(url) {
        let title = await getTitle(url);
        let writer = fs.createWriteStream(`./${folder}/${title}.mp3`);

        ytdl(url, {
            format: 'mp3',
            filter: 'audioonly',
        }).pipe(writer);

        writer.on("finish", () => {
            back.send("downloadInfo", `Le téléchargement de ${title} est fini !`);
        });
    }

    async function downloadPlaylistMP3(url, title, playlistTitle, numberOfSongs, downloadedSongs) {
        let writer = fs.createWriteStream(`./${folder}/${title}.mp3`);
    
        ytdl(url, {
            format: 'mp3',
            filter: 'audioonly',
        }).pipe(writer);
    
        writer.on("finish", () => {
            back.send("downloadInfo", `Playlist ${playlistTitle} -> Le téléchargement de ${title} est fini ! (${downloadedSongs}/${numberOfSongs})`);
        });
    }

    //Partie MP4
    async function downloadMP4(url) {
        let title = await getTitle(url);
        let writer = fs.createWriteStream(`./${folder}/${title}.mp4`);

        ytdl(url, { 
            filter: 'audioandvideo', 
            quality: 'highestvideo' 
        })
        .pipe(writer);

        writer.on("finish", () => {
            back.send("downloadInfo", `Le téléchargement de ${title} est fini !`);
        });
    }

    async function downloadPlaylistMP4(url, title, playlistTitle, numberOfSongs, downloadedVideos) {
        let writer = fs.createWriteStream(`./${folder}/${title}.mp4`);
    
        ytdl(url, { 
            filter: 'audioandvideo', 
            quality: 'highestvideo' 
        })
        .pipe(writer);
    
        writer.on("finish", () => {
            back.send("downloadInfo", `Playlist ${playlistTitle} -> Le téléchargement de ${title} est fini ! (${downloadedVideos}/${numberOfSongs})`);
        });
    }

    //Traitement de toutes les informations (playlist + format de téléchargement)
    if (format === "mp3") {
        if (playlist === "playlist") {
            let playlistInfos = await getPlaylistInfos(url);
            let downloadedSongs = 0;
            for (const videoID of titleOfPlaylist) {
                let title = await getTitle(videoID);
                downloadedSongs++;
                downloadPlaylistMP3(videoID, title, playlistInfos.titleOfPlaylist, playlistInfos.numberOfSongs, downloadedSongs);
            }
        } else {
            downloadMP3(url);
        }
    }

    if (format === "mp4") {
        if (playlist === "playlist") {
            let playlistInfos = await getPlaylistInfos(url);
            let downloadedVideos = 0;
            for (const videoID of titleOfPlaylist) {
                let title = await getTitle(videoID);
                downloadedVideos++;
                downloadPlaylistMP4(videoID, title, playlistInfos.titleOfPlaylist, playlistInfos.numberOfSongs, downloadedVideos);
            }
        } else {
            downloadMP4(url);
        }
    }
});