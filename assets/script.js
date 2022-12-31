front.on("downloadInfo", function(msg){
	console.log(msg);
	$('#statut').html(msg);
	alert(msg);
});

front.on("urlError", (urlError) => {
	alert(urlError);
})