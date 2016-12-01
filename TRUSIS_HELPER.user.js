// ==UserScript==
// @id             trusis-helper
// @name           TRUSIS HELPER: Helper per il gioco online Trusis (trusis.it)
// @version        0.162
// @author         Jacopo1891
// @namespace
// @updateURL      https://github.com/Jacopo1891/Trusis_Helper/raw/master/TRUSIS_HELPER.user.js
// @downloadURL    https://github.com/Jacopo1891/Trusis_Helper/raw/master/TRUSIS_HELPER.user.js
// @description    v 0.162 NUOVA FUNZIONE: Chat con colori personalizzati
// @include        https://trusis.altervista.org/*
// @include        http://trusis.altervista.org/*
// @match          http://trusis.altervista.org/*
// @match          https://trusis.altervista.org/*
// @grant          none
// ==/UserScript==
var spectrum_js = "http://bgrins.github.io/spectrum/spectrum.js";
var spectrum_css = "http://bgrins.github.io/spectrum/spectrum.css";
$('head').append('<script type="text/javascript" src="' + spectrum_js + '"></script>');
$('head').append('<link rel="stylesheet" type="text/css" href="' + spectrum_css + '">');

$(window).on("load", function() {
    var trusis_helper_list = trusis_helper_role();
    trusis_helper_note( trusis_helper_list );
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
                    var temp_list = [tempNick.replace(" ", "_") , ruolo];
                    trusis_helper_list = addToCookieList (trusis_helper_list, temp_list);
                    // Salvo sui Cookie
                    saveCookie(trusis_helper_list);
                }
            }
        }if (e.id == 'trusis_helper_img') {
            var nickRemove = $(e).parent().parent().text();
            trusis_helper_list = removePlayer(trusis_helper_list, nickRemove);
            // Salvo sui Cookie
            saveCookie(trusis_helper_list);
            $(e).remove();
        }if (e.id == "helper_note"){
            $(".home_helper_element").toggle();
        }
        if (e.id == "save_note_helper"){
            trusis_helper_list = save_note_helper( trusis_helper_list );
            document.getElementById("save_note_helper").innerHTML="Salvato!";
            setTimeout(function(){
                document.getElementById("save_note_helper").innerHTML="Salva";
            },3500);
            // Salvo sui Cookie
            saveCookie(trusis_helper_list);
        }
        if (e.id == "export_note_helper"){
            var temp_note_export = export_trusis_helper_note( trusis_helper_list );
            var w = 400;
            var h = 250;
            var l = Math.floor((screen.width-w)/2);
            var t = Math.floor((screen.height-h)/2);
            var stili = "top=10, left=10, width="+w+", height="+h+",top=" + t + ",left=" + l +" status=no, menubar=no, toolbar=no scrollbars=no";
            var testo = window.open("", "", stili);

            testo.document.write("<html>");
            testo.document.write("<head>");
            testo.document.write("<title>Trusis_Helper - Note</title>");
            testo.document.write("</head>");
            testo.document.write("<body topmargin=5>");
            testo.document.write("<div align=center><b>Note esportate:</b></div>\n");
            testo.document.write("<div>"+temp_note_export+"</div>");
            testo.document.write("</body>\n");
            testo.document.write("</html>");
            document.getElementById("export_note_helper").innerHTML="Fatto!";
            setTimeout(function(){
                document.getElementById("export_note_helper").innerHTML="Esporta";
            },3500);
        }
    }

    $('#view_ajax').bind("DOMSubtreeModified",function(){
        set_color_chat_all(trusis_helper_list);
    });
    var lista = document.getElementsByClassName('avatar');
    for (var i = 0; i < lista.length; i++) {
        var tempCard = lista[i].getElementsByClassName('avatar_name');
        var tempNick = $(tempCard).children('a.nowrap').text();
        var colore = get_color_chat(trusis_helper_list, tempNick);
        $('#color_'+tempNick.replace(" ", "_")).spectrum({
            color: colore,
            showPaletteOnly: true,
            togglePaletteOnly: true,
            palette: [
                ["#000","#444","#666","#999","#ccc","#eee","#f3f3f3","#fff"],
                ["#f00","#f90","#ff0","#0f0","#0ff","#00f","#90f","#f0f"],
                ["#f4cccc","#fce5cd","#fff2cc","#d9ead3","#d0e0e3","#cfe2f3","#d9d2e9","#ead1dc"],
                ["#ea9999","#f9cb9c","#ffe599","#b6d7a8","#a2c4c9","#9fc5e8","#b4a7d6","#d5a6bd"],
                ["#e06666","#f6b26b","#ffd966","#93c47d","#76a5af","#6fa8dc","#8e7cc3","#c27ba0"],
                ["#c00","#e69138","#f1c232","#6aa84f","#45818e","#3d85c6","#674ea7","#a64d79"],
                ["#900","#b45f06","#bf9000","#38761d","#134f5c","#0b5394","#351c75","#741b47"],
                ["#600","#783f04","#7f6000","#274e13","#0c343d","#073763","#20124d","#4c1130"]
            ],
            change: function(color) {
                var id = $(this).attr('id');
                trusis_helper_list = addColorToCookieList(trusis_helper_list, id, color.toHexString());
                saveCookie( trusis_helper_list );
                set_color_chat (id, color.toHexString());
            }
        });
    }
    set_color_chat_all(trusis_helper_list);
});
function trusis_helper_role() {
    var url = document.URL.split("/");
    var url_part = url[3];
    if ( url_part != "game"){
        return;
    }
    var match = url[4];
    var temp_list = ["partita" , match];

    trusis_helper_list = restoreCookie();
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
    return trusis_helper_list;
}

function sceltaRuolo(){
    var ruoliPossibili = "\n1= Umano\n2= Truso\n3= Spazzino\n4= Becchino\n5 = Parroco\n6= Macellaio\n7= Suocera\n8= Oracolo\n9= Pal.Bianco\n10= Kamikaze\n11= Naufrago\n12= Profanatrice\n13= Pal.Nero\n14= Martire\n15= Illusionista\n16= Non truso";
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
        case "16":
            return 16;
        default:
            return 0;
    }
}

function createLink(n){
    // Dato il ruolo restituisce il link all'immagine
    var link;
    if (n > 0 && n < 16){
        link = "css/images/symbols/card"+n+".png";
    }else if (n == 16){
        link = "css/images/symbols/card102.png";
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
    // Aggiorna i cookie
    document.cookie = "cookie_trusis_helper = "+ JSON.stringify(info);
}

function restoreCookie() {
    // Ripristina i cookie salvati
    var cname = "cookie_trusis_helper";
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length,c.length);
        }
    }
    return "";
}

function addToCookieList (list_cookie , element){
    // Aggiunge informazioni alla lista
    for (var i =0; i< list_cookie.length; i++) {
        var cookie_element = list_cookie[i];
        if (cookie_element[0] == element[0].replace(" ", "_")){
            cookie_element[1] = element[1];
            return list_cookie;
        }
    }
    list_cookie.push(element);
    return list_cookie;
}

function restoreRole( lista_ruoli_cookie ){
    var lista = document.getElementsByClassName('avatar');
    for (var j=0; j < lista_ruoli_cookie.length; j++){
        var temp = lista_ruoli_cookie[j];

        for (var i = 0; i < lista.length; i++) {
            var tempCard = $(lista.item(i)).children('div.avatar_name, div#m_.avatar_name.an_vote');
            var tempNick = $(tempCard).children('a.nowrap').text();
            var nickname = tempNick;
            if (tempNick.replace(" ", "_") == temp[0]){
                var ruolo = temp[1];
                // Setto la card
                if (ruolo !== ""){
                    addRolePlayer(tempCard, ruolo);
                }
            }
        }
    }
}

function removePlayer(list, nick){
    // Rimuove le informazioni salvate di uno giocatore dalla lista
    for (var i = 0; i< list.length; i++) {
        var list_element = list[i];
        if (list_element[0] == nick.replace(" ", "_")){
            list_element[1] = "";
            return list;
        }
    }
    return list;
}

function addRolePlayer(playerHtmlElement, ruolo){
    // Aggiunge le informazioni al giocatore
    var htmlImgLink = createHtmlImgCode(ruolo);
    var tempLocationCard = $(playerHtmlElement).parent().children('div.cardfg, div.cardfggy');
    if (typeof tempLocationCard !== "undefined"){
        $(tempLocationCard).append(htmlImgLink);
    }else{
        console.log("Errore: impossibile aggiungere il ruolo.");
    }
}

function html_note_code( player_code ){
    // Restituisce l'html del pannello per le note
    var htl_link = "https://raw.githubusercontent.com/Jacopo1891/Trusis_Helper/master/img/htl.png";
    var ht_link = "https://raw.githubusercontent.com/Jacopo1891/Trusis_Helper/master/img/ht.png";
    var htr_link = "https://raw.githubusercontent.com/Jacopo1891/Trusis_Helper/master/img/htr.png";
    var hl_link = "https://raw.githubusercontent.com/Jacopo1891/Trusis_Helper/master/img/hl.png";
    var hr_link = "https://raw.githubusercontent.com/Jacopo1891/Trusis_Helper/master/img/hr.png";
    var hbl_link = "https://raw.githubusercontent.com/Jacopo1891/Trusis_Helper/master/img/hbl.png";
    var hb_link = "https://raw.githubusercontent.com/Jacopo1891/Trusis_Helper/master/img/hb.png";
    var hbr_link = "https://raw.githubusercontent.com/Jacopo1891/Trusis_Helper/master/img/hbr.png";

    var html_code = '<table class="home_helper">'
    + '<tbody>'
    + '<tr>'
    + '<td class="home_tl" style="background: url('+htl_link+') no-repeat left bottom;"></td>'
    + '<td class="home_t" style="background: url('+ht_link+') repeat-x left bottom;"><img id="helper_note" src="https://raw.githubusercontent.com/Jacopo1891/Trusis_Helper/master/img/home_helper.png" /></td>'
    + '<td class="home_tr" style="background: url('+htr_link+') no-repeat right bottom;"></td>'
    + '</tr>'
    + '<tr>'
    + '<td class="home_l" style="background: url('+hl_link+');"></td>'
    + '<th class="home_c">'
    + '<div class="home_helper_element" style="display: none;">'
    + player_code
    + '<div style="display: flex; flex-grow: 1; width: 100%; list-style-type: none;">'
    + '<button style="margin: 0 auto; border-radius:6px; width:100px; background-color: #112; color: #AEAEAE; border: 0; padding: 4px 7px; text-align:center;" id="save_note_helper">Salva</button>'
    + '<button style="margin: 0 auto; border-radius:6px; width:100px; background-color: #112; color: #AEAEAE; border: 0; padding: 4px 7px; text-align:center;" id="export_note_helper">Esporta</button></div>'
    + '</div>'
    + '</th>'
    + '<td class="home_r" style="background: url('+hr_link+');"></td>'
    + '</tr>'
    + '<tr></tr>'
    + '<tr>'
    + '<td class="home_bl" style="background: url('+hbl_link+') no-repeat left top;"></td>'
    + '<td class="home_b" style="text-align:right; background: url('+hb_link+') repeat-x left top;">'
    + '</td>'
    + '<td class="home_br" style="background: url('+hbr_link+') no-repeat right top;"></td>'
    + '</tr>'
    + '</tbody>'
    + '</table>';

    return html_code;
}

function trusis_helper_note( l ){
    // Lista di tutti gli elementi con la classe 'avatar_name'
    var lista = document.getElementsByClassName('avatar');
    var stringHtml = "";
    var first_dead = "";
    for (var i = 0; i < lista.length; i++) {
        var tempCard = lista[i].getElementsByClassName('avatar_name');
        var cimitero = $(tempCard).parent().hasClass( "avatar_dead" );
        if (cimitero === true && first_dead === ""){
            stringHtml += '<div style="display: flex; flex-grow:1; width:100%; list-style-type:none;">'
                +'<li style="text-align: center; margin-left: 40%; ">! ---- Cimitero ---- !</li>'
                +'</div>';
            first_dead = "found";
        }
        var tempNick = $(tempCard).children('a.nowrap').text();
        var tempNick_link = $(tempCard).children('a.nowrap').attr('href');
        var note = "";
            for(var j = 0; j < l.length; j++){
                if( l[j].length >2 && l[j][0] === tempNick.replace(" ", "_")){
                    note = l[j][2];
                    break;
                }
            }

        stringHtml += '<div style="display: flex; flex-grow: 1; width: 100%; list-style-type: none; id=color_"'
            + tempNick.replace(" ", "_")
            + '">'
            + '<input type="text" id="color_'+ tempNick.replace(" ", "_") +'" />'
            + '<li style="flex-grow: 1; vertical-align:middle; padding-left:10px; padding-top:5px; width: 30px;">'
            + '<a href="'+tempNick_link+'">'+tempNick+'</a>'
            + '</li><li style="flex-grow: 3; vertical-align:middle; padding-left:10px; padding-right: 20px; margin-top:-2px; ">'
            + '<textarea class="trusis_helper_note" id="'
            + tempNick.replace(" ", "_")
            + '" style="resize:none; width: 100%; border-radius: 10px; background-color: #346; padding-left: 10px; color: #CDF; margin: 0px 0px -20px 0px;">'
            + note
            + '</textarea></li></div><br>';
    }
    var html_code = html_note_code( stringHtml );

    var html_player_alive = document.getElementsByClassName('home');
    $(html_code).insertAfter(html_player_alive);
}

function save_note_helper( l ){
    // Salva le note e aggiorna la lista in ingresso contenenti i ruoli / note già salvate
    var lista = document.getElementsByClassName('avatar');
    for (var i = 0; i < lista.length; i++) {
        var tempCard = lista[i].getElementsByClassName('avatar_name');
        var tempNick = $(tempCard).children('a.nowrap').text();
        var textarea_area_element = "textarea#"+tempNick.replace(" ", "_");
        var temp_note = $(textarea_area_element).val();
        if ( typeof temp_note !== 'undefined'){
            var check = true;
            for(var j = 0; j < l.length; j++){
                if(l[j][0] === tempNick.replace(" ", "_")){
                    if ( l.length <= 2 ){
                        l[j].splice(2, 0, temp_note);
                    }
                    else{
                        l[j][2] = temp_note;
                    }
                    check = false;
                    break;
                }
            }
            if (check){
                // Controllo che non sia una nuova informazione
                new_value_with_note = [tempNick.replace(" ", "_"), "", temp_note];
                l.push(new_value_with_note);
            }
        }
    }
    return l;
}

function export_trusis_helper_note( l ){
    var result = "";
    for (var i = 1; i < l.length; i++) {
        result += "<div><b>"+l[i][0] + "</b>= ";
        if (l[i][2] !== 'undefined' && l[i][2] !== ""){
            result += l[i][2] + ";</div>\n";
        }else{
            result += "?;</div>\n";
        }
    }
    return result;
}

function set_color_chat (id, colore){
    var player = id.replace("color_", "");
    var nick = player.replace("_", " ");
    var lista = document.getElementsByClassName('chat_message');
    for (var i=0; i<lista.length; i++){
        var tempNick = $(lista[i]).children('a').text();
        if (tempNick == nick){
            $(lista[i]).css('color', colore);
        }
    }
}

function get_color_chat (list_cookie, nickname){
    var nick = nickname.replace(" ", "_");
    for (var i=0; i<list_cookie.length; i++){
        var element_list = list_cookie[i];
        if (nick === element_list[0]){
            if( typeof element_list[3] !== 'undefined' ){
                // Restituisce il colore impostato
                return element_list[3];
            }else{
                // Colore di default
                return "AAC";
            }
        }
    }
    // In caso non trovi il nick -> Colore di default
    return "#AAC";
}

function addColorToCookieList (list_cookie, id, colore){
    // Aggiunge informazioni alla lista
    var nick = id.replace("color_", "");
    for (var i =0; i< list_cookie.length; i++) {
        var cookie_element = list_cookie[i];
        if (cookie_element[0] === nick){
            if (cookie_element.length == 4){
                cookie_element[3] = colore;
                return list_cookie;
            }else{
                cookie_element.push(colore);
                return list_cookie;
            }
        }
    }
}

function set_color_chat_all(list_cookie){
    for (var i =0; i< list_cookie.length; i++) {
        var element_list = list_cookie[i];
        var nick = element_list[0];
        if( typeof element_list[3] !== 'undefined' ){
            var id = "color_"+nick;
            set_color_chat (id, element_list[3]);
        }
    }
}
