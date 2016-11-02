// ==UserScript==
// @id             trusis-helper
// @name           TRUSIS HELPER: Mentire è solo l'inizio (www.trusis.it)
// @version        0.141
// @namespace
// @updateURL      https://github.com/Jacopo1891/Trusis_Helper/raw/master/TRUSIS_HELPER.user.js
// @downloadURL    https://github.com/Jacopo1891/Trusis_Helper/raw/master/TRUSIS_HELPER.user.js
// @description    [Jacopo1891] Helper per Trusis
// @include        https://trusis.altervista.org/*
// @include        http://trusis.altervista.org/*
// @match          http://trusis.altervista.org/*
// @match          https://trusis.altervista.org/*
// @grant          none
// ==/UserScript==

$(window).on("load", function() {
    trusis_helper();
});
function trusis_helper() {
    var url = document.URL.split("/");
    var url_part = url[3];
    if ( url_part != "game"){
        return;
    }
    var match = url[4];
    var temp_list = ["partita" , match];

    var trusis_helper_list = restoreCookie();
    if ( trusis_helper_list === ""){
        trusis_helper_list = [];
        trusis_helper_list.push(temp_list);
    }else{
        var trusis_helper_list_temp =  $.parseJSON( trusis_helper_list );
        if (temp_list[1] === trusis_helper_list_temp[0][1]){
            trusis_helper_list = trusis_helper_list_temp;
            restoreRole(trusis_helper_list);
        }else{
            var cancVecchiaPartita = confirm("Trusis_Helper:\nVuoi cancellare i dati della precedente partita? \n(Consigliato se si inizia una nuova)");
            if(cancVecchiaPartita === true){
                trusis_helper_list = [];
                trusis_helper_list.push(temp_list);
                saveCookie(trusis_helper_list);
            }
            if(cancVecchiaPartita === false){
                alert("I ruoli inseriti in questa partita saranno ignorati.");
            }
        }
    }

    document.body.onclick = function(e) {   //Document body clicked
        if (window.event) {
            e = event.srcElement;           //e = elemento cliccato
        }
        else {
            e = e.target;                   //e = elemento cliccato
        }

        if (e.className && e.className.indexOf('avatar_name') != -1) {
            var nickClicked = $(e).children('a').text();

            // Lista di tutti gli elementi con la classe 'avatar_name'
            var lista = document.getElementsByClassName('avatar');
            for (var i = 0; i < lista.length; i++) {
                var tempCard = lista[i].getElementsByClassName('avatar_name');
                var tempNick = $(tempCard).children('a.nowrap').text();
                var nickname = tempNick;
                if (nickname == nickClicked){
                    var ruolo = sceltaRuolo();
                    // Setto la card
                    addRolePlayer(tempCard, ruolo);
                    // Aggiorno la lista dei player "etichettati"
                    var temp_list = [nickname , ruolo];
                    trusis_helper_list = addToCookieList (trusis_helper_list, temp_list);
                    // Salvo sui Cookie
                    saveCookie(trusis_helper_list);
                }
            }
        }if (e.id && e.id.indexOf('trusis_helper_img') != -1) {
            var nickRemove = $(e).parent().parent().text();
            trusis_helper_list = removePlayer(trusis_helper_list, nickRemove);
            // Salvo sui Cookie
            saveCookie(trusis_helper_list);
            $(e).remove();

        }
    }
}

function sceltaRuolo(){
    var ruoliPossibili = "\n1= Umano\n2= Truso\n3= Spazzino\n4= Becchino\n5 = Parroco\n6= Macellaio\n7= Suocera\n8= Oracolo\n9= Pal.Bianco\n10= Kamikaze\n11= Naufrago\n12= Profanatrice\n13= Pal.Nero\n14= Martire\n15= Illusionista";
    var ruolo = prompt("Che ruolo ha il player?"+ruoliPossibili);
    switch(ruolo) {
        case "1":
            return 1;
        case "2":
            return 2;
        case "3":
            return 3;
        case "4":
            return 4;
        case "5":
            return 5;
        case "6":
            return 6;
        case "7":
            return 7;
        case "8":
            return 8;
        case "9":
            return 9;
        case "10":
            return 10;
        case "11":
            return 11;
        case "12":
            return 12;
        case "13":
            return 13;
        case "14":
            return 14;
        case "15":
            return 15;
        default:
            return 0;
    }
}

function createLink(n){
    // Dato il ruolo restituisce il link all'immagine
    var link;
    if (n > 0 || n <16){
        link = "css/images/symbols/card"+n+".png";
    }else{
        link = "css/images/characters/0.png";
    }
    return link;
}

function createHtmlImgCode(n){
    // Dato il link all'immagine restituisce il codice per aggiungela sopra all'immagine profilo
    var link = createLink(n);
    var code = '<img src="'+link+'" id="trusis_helper_img" style="max-height:35px">';
    return code;
}

function saveCookie(info){
    document.cookie = "cookie_trusis_helper = "+ JSON.stringify(info);
}

function restoreCookie() {
    var cname = "cookie_trusis_helper";
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length,c.length);
        }
    }
    return "";
}

function addToCookieList (list , element){
    list = removePlayer(list , element[0]);
    list.push(element);
    return list;
}

function restoreRole( lista_ruoli_cookie ){
    var lista = document.getElementsByClassName('avatar');
    for (var j=0; j < lista_ruoli_cookie.length; j++){
        var temp = lista_ruoli_cookie[j];

        for (var i = 0; i < lista.length; i++) {
            var tempCard = $(lista.item(i)).children('div.avatar_name, div#m_.avatar_name.an_vote');
            var tempNick = $(tempCard).children('a.nowrap').text();
            var nickname = tempNick;
            if (nickname == temp[0]){
                var ruolo = temp[1];
                // Setto la card
                addRolePlayer(tempCard, ruolo);
            }
        }
    }
}

function removePlayer(list, nick){
    for (var i =0; i< list.length; i++) {
        var list_element = list[i];
        if (list_element[0] == nick){
            list.splice(i, 1);
            return list;
        }
    }
    return list;
}

function addRolePlayer(playerHtmlElement, ruolo){
    var htmlImgLink = createHtmlImgCode(ruolo);
    var tempLocationCard = $(playerHtmlElement).parent().children('div.cardfg, div.cardfggy');
    if (typeof tempLocationCard !== "undefined"){
        $(tempLocationCard).append(htmlImgLink);
    }else{
        console.log("Errore: impossibile aggiungere il ruolo.");
    }
}
