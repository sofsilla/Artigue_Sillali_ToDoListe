// Script de téléchargement de l'image QrCode
function prepHref(linkElement) {
	var someimage = document.getElementById('qrContainer');
	var myimg = someimage.getElementsByTagName('img')[0];
	linkElement.href = myimg.src;
}