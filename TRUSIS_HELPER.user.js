// ==UserScript==
// @id             trusis-helper
// @name           TRUSIS HELPER: Helper per il gioco online Trusis (trusis.it)
// @version        0.164
// @author         Jacopo1891
// @namespace
// @updateURL      https://github.com/Jacopo1891/Trusis_Helper/raw/master/TRUSIS_HELPER.user.js
// @downloadURL    https://github.com/Jacopo1891/Trusis_Helper/raw/master/TRUSIS_HELPER.user.js
// @description    Helper per Trusis, con note aggiuntive e segnaruoli online
// @include        https://trusis.altervista.org/*
// @include        http://trusis.altervista.org/*
// @match          http://trusis.altervista.org/*
// @match          https://trusis.altervista.org/*
// @grant          none
// ==/UserScript==
var spectrum_js = "https://rawgit.com/Jacopo1891/Trusis_Helper/master/js/spectrum.js";
var spectrum_css = "https://rawgit.com/Jacopo1891/Trusis_Helper/master/css/spectrum.css";
var jquery_ui_js = "https://rawgit.com/Jacopo1891/Trusis_Helper/master/js/jquery-ui.js";
var jquery_ui_css = "https://rawgit.com/Jacopo1891/Trusis_Helper/master/css/jquery-ui.css";
var lz_string_js = "https://rawgit.com/pieroxy/lz-string/master/libs/lz-string.js";

var url_update = "https://github.com/Jacopo1891/Trusis_Helper/raw/master/TRUSIS_HELPER.user.js";
var trusis_helper_css = "https://rawgit.com/Jacopo1891/Trusis_Helper/master/css/trusis_helper.css";


$('head').append('<script type="text/javascript" src="' + spectrum_js + '"></script>');
$('head').append('<link rel="stylesheet" type="text/css" href="' + spectrum_css + '">');
$('head').append('<script type="text/javascript" src="' + jquery_ui_js + '"></script>');
$('head').append('<link rel="stylesheet" type="text/css" href="' + jquery_ui_css + '">');
$('head').append('<link rel="stylesheet" type="text/css" href="' + trusis_helper_css + '">');

$('head').append('<script type="text/javascript" src="' + lz_string_js + '"></script>');

$(window).on("load", function() {
    var trusis_helper_list = trusis_helper_role();
/*
    console.log(trusis_helper_list.toString());
    var encode = btoa(trusis_helper_list);
    console.log(encode);
    var LZString_compress = LZString.compress( encode );
    console.log(LZString_compress);
*/
    html_note_code( trusis_helper_list );
    trusis_helper_navbar();
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
        }
        else if (e.id == 'trusis_helper_img') {
            var nickRemove = $(e).parent().parent().text();
            trusis_helper_list = removePlayer(trusis_helper_list, nickRemove);
            // Salvo sui Cookie
            saveCookie(trusis_helper_list);
            $(e).remove();
        }
        else if (e.id == "helper_note"){
            $(".home_helper_element").toggle();
        }
        else if (e.id == "save_note_helper"){
            trusis_helper_list = save_note_helper( trusis_helper_list );
            document.getElementById("save_note_helper").innerHTML="Salvato!";
            setTimeout(function(){
                document.getElementById("save_note_helper").innerHTML="Salva";
            },3500);
            // Salvo sui Cookie
            saveCookie(trusis_helper_list);
        }
        else if (e.id == "export_note_helper"){
            trusis_helper_list = save_note_helper( trusis_helper_list );
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
        else if (e.id == "tab_d"){
            $('#tab_b').removeClass('tabberactive');
            $('#tab2').addClass('tabbertabhide');
            $('#tab_n').removeClass('tabberactive');
            $('#tab3').addClass('tabbertabhide');

            $('#tab_d').addClass('tabberactive');
            $('#tab1').removeClass('tabbertabhide');
        }
        else if (e.id == "tab_b"){
            $('#tab_d').removeClass('tabberactive');
            $('#tab1').addClass('tabbertabhide');
            $('#tab_n').removeClass('tabberactive');
            $('#tab3').addClass('tabbertabhide');

            $('#tab_b').addClass('tabberactive');
            $('#tab2').removeClass('tabbertabhide');
        }
        else if (e.id == "tab_n"){
            $('#tab_d').removeClass('tabberactive');
            $('#tab1').addClass('tabbertabhide');
            $('#tab_b').removeClass('tabberactive');
            $('#tab2').addClass('tabbertabhide');

            $('#tab_n').addClass('tabberactive');
            $('#tab3').removeClass('tabbertabhide');
        }
        else if (e.id == "info_trusis_helper"){
            var w = 315;
            var h = 300;
            var l = Math.floor((screen.width-w)/2);
            var t = Math.floor((screen.height-h)/2);
            var stili = "top=10, left=10, width="+w+", height="+h+",top=" + t + ",left=" + l +" status=no, menubar=no, toolbar=no scrollbars=no resizable=no";
            var testo = window.open("", "", stili);

            testo.document.write("<html>");
            testo.document.write("<head>");
            testo.document.write("<title>Trusis Helper - Info</title>");
            testo.document.write("<link rel='stylesheet' type='text/css' href='"+ trusis_helper_css +"'>");
            testo.document.write("</head>");
            testo.document.write("<body class='t_helper'>");
            testo.document.write("<div class='th_title_info'><b>Trusis Helper:</b></div>\n");
            testo.document.write("<div class='th_info'>@Autore: Jacopo1891 ~ <a href='/member/5297' target='_blank'>RobinHood</a></div>");
            testo.document.write("<div class='th_info'>@Versione: 0.164 ~ <a href='"+ url_update +"' target='_blank'>Ultima versione</a> </div>");
            testo.document.write("<div class='th_info'>@News: <a href='/tag/TrusisHelper' target='_blank'>#TrusisHelper</a></div>");
            testo.document.write("<div class='th_info'>Per consigli o suggerimenti contattatemi su Trusis con il mio alias o chiedete di me nel gruppo fb!</div>");
            testo.document.write("<div class='th_info'>\n\n</div>");
            testo.document.write("<div class='th_info'>* A causa del plug-in il gioco potrebbe risultare leggermente rallentato: è normale, dipende dalle funzioni aggiunte! *</div>");
            testo.document.write("</body>\n");
            testo.document.write("</html>");
        }
    }
    trusis_helper_list = save_note_helper( trusis_helper_list );
    $('#view_ajax').bind("DOMSubtreeModified",function(){
        set_color_chat_all(trusis_helper_list);
        //link_to_player_tag();
    });
    var lista = document.getElementsByClassName('avatar');
    var availableTags = [];
    for (var i = 0; i < lista.length; i++) {
        var tempCard = lista[i].getElementsByClassName('avatar_name');
        var tempNick = $(tempCard).children('a.nowrap').text();
        availableTags.push("@"+tempNick.replace(" ", "_"));
        var colore = get_color_chat(trusis_helper_list, tempNick);
        /*if (colore === ""){
            colore = "#AAC";
        }*/
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
    //link_to_player_tag();

    function split(val) {
        return val.split(/@\s*/);
    }

    function extractLast(term) {
        return split(term).pop();
    }

    $('#chat').bind('autocompleteopen', function(event, ui) {
        $(this).data('is_open',true);
    });

    $('#chat').bind('autocompleteclose', function(event, ui) {
        $(this).data('is_open',false);
    });

    $("#chat").bind("keydown", function(event) {
        // don't navigate away from the field on tab when selecting an item
        if ( $(this).data('is_open') && event.keyCode === $.ui.keyCode.TAB ){
            event.preventDefault();
        }
    }).autocomplete({
        source: function(request, response) {
            var term = request.term,
                results = [];
            if (term.indexOf("@") >= 0) {
                term = extractLast(request.term);
                if (term.length > 0) {
                    results = $.ui.autocomplete.filter(
                        availableTags, term);
                }
            }
            response(results);
        },
        focus: function() {
            // prevent value inserted on focus
            return false;
        },
        select: function(event, ui) {
            var terms = split(this.value);
            // remove the current input
            terms.pop();
            for(var i = 0; i < terms.length; i++ ){
                if(i > 0){
                    terms[i] = "@"+terms[i];
                }
            }
            // add the selected item
            terms.push(ui.item.value);
            // add placeholder to get the comma-and-space at the end
            terms.push("");
            this.value = terms.join("");
            return false;
        }
    });

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
    var ruoliPossibili =
        "\n1= Umano"+
        "\n2= Truso"+
        "\n3= Spazzino"+
        "\n4= Becchino"+
        "\n5 = Parroco"+
        "\n6= Macellaio"+
        "\n7= Suocera"+
        "\n8= Oracolo"+
        "\n9= Pal.Bianco"+
        "\n10= Kamikaze"+
        "\n11= Naufrago"+
        "\n12= Profanatrice"+
        "\n13= Pal.Nero"+
        "\n14= Martire"+
        "\n15= Illusionista"+
        "\n16= Non truso";
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
    var CookieDate = new Date();
    CookieDate.setFullYear(CookieDate.getFullYear( ) +1);
    document.cookie = "cookie_trusis_helper = "+ JSON.stringify(info)+ "; expires=" + CookieDate.toGMTString( ) + ";";
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

function html_note_code( l ){
    // Restituisce l'html del pannello per le note
    var htl_link = "https://raw.githubusercontent.com/Jacopo1891/Trusis_Helper/master/img/htl.png";
    var ht_link = "https://raw.githubusercontent.com/Jacopo1891/Trusis_Helper/master/img/ht.png";
    var htr_link = "https://raw.githubusercontent.com/Jacopo1891/Trusis_Helper/master/img/htr.png";
    var hl_link = "https://raw.githubusercontent.com/Jacopo1891/Trusis_Helper/master/img/hl.png";
    var hr_link = "https://raw.githubusercontent.com/Jacopo1891/Trusis_Helper/master/img/hr.png";
    var hbl_link = "https://raw.githubusercontent.com/Jacopo1891/Trusis_Helper/master/img/hbl.png";
    var hb_link = "https://raw.githubusercontent.com/Jacopo1891/Trusis_Helper/master/img/hb.png";
    var hbr_link = "https://raw.githubusercontent.com/Jacopo1891/Trusis_Helper/master/img/hbr.png";
    var home_img_link = "https://raw.githubusercontent.com/Jacopo1891/Trusis_Helper/master/img/home_helper.png";

    var player_code_note = trusis_helper_note( l );
    var player_code_ruoli = trusis_helper_ruoli( l );
    var player_code_bluff = trusis_helper_bluff( l );

    var html_code = '<table class="home_helper">'
    + '<tbody>'
    + '<tr>'
    + '<td class="home_tl" style="background: url('+htl_link+') no-repeat left bottom;"></td>'
    + '<td class="home_t" style="background: url('+ht_link+') repeat-x left bottom;"><img id="helper_note" src="'+ home_img_link +'" /></td>'
    + '<td class="home_tr" style="background: url('+htr_link+') no-repeat right bottom;"></td>'
    + '</tr>'
    + '<tr>'
    + '<td class="home_l" style="background: url('+hl_link+');"></td>'
    + '<th class="home_c">'
    + '<div class="home_helper_element" style="display: none;">'
    +'<div class="tabberlive" id="tabber">'
    +'    <ul class="tabbernav">'
    +'        <li class="" id="tab_d">'
    +'            <a href="javascript:void(null);" title="Dichiarato" id="tab_d">Dichiarato</a>'
    +'        </li>'
    +'        <li class="" id="tab_b">'
    +'            <a href="javascript:void(null);" title="Bluff" id="tab_b">Bluff</a>'
    +'        </li>'
    +'        <li class="tabberactive" id="tab_n">'
    +'            <a href="javascript:void(null);" title="Note" id="tab_n">Note</a>'
    +'        </li>'
    +'    </ul>'
    +'    <div class="tabbertab tabbertabhide" id="tab1" title="">'
    +'        <table>'
    +'            <tbody>'
    + player_code_ruoli
    +'            </tbody>'
    +'        </table>'
    +'  </div>'
    +'    <div class="tabbertab tabbertabhide" id="tab2" title="">'
    +'        <table>'
    +'            <tbody>'
    + player_code_bluff
    +'            </tbody>'
    +'        </table>'
    +'    </div>'
    +'    <div class="tabbertab" id="tab3" title="">'
    +'        <table>'
    +'            <tbody> '
    + player_code_note
    +'            </tbody>'
    +'        </table>'
    +'    </div>'
    +'</div>'
    + '<div style="display: flex; flex-grow: 1; width: 100%; list-style-type: none;">'
    + '<button style="margin: 0 auto; border-radius:6px; width:100px; background-color: #112; color: #AEAEAE; border: 0; padding: 4px 7px; text-align:center;" id="save_note_helper">'
    + 'Salva</button>'
    + '<button style="margin: 0 auto; border-radius:6px; width:100px; background-color: #112; color: #AEAEAE; border: 0; padding: 4px 7px; text-align:center;" id="export_note_helper">'
    + 'Esporta</button></div>'
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

    var html_player_alive = document.getElementsByClassName('home');
    $(html_code).insertAfter(html_player_alive);
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
            + '<textarea class="trusis_helper_note" id="note_'
            + tempNick.replace(" ", "_")
            + '" style="resize:none; width: 100%; border-radius: 10px; background-color: #346; padding-left: 10px; color: #CDF; margin: 0px 0px -20px 0px;">'
            + note
            + '</textarea></li></div><br>';
    }
    return stringHtml;
}

function save_note_helper( l ){
    // Salva le note e aggiorna la lista in ingresso contenenti i ruoli / note già salvate
    var lista = document.getElementsByClassName('avatar');
    for (var i = 0; i < lista.length; i++) {
        var tempCard = lista[i].getElementsByClassName('avatar_name');
        var tempNick = $(tempCard).children('a.nowrap').text();
        var textarea_area_element_note = "textarea#note_"+tempNick.replace(" ", "_");
        var textarea_area_element_ruolo = "textarea#ruoli_"+tempNick.replace(" ", "_");
        var textarea_area_element_bluff = "textarea#bluff_"+tempNick.replace(" ", "_");
        var temp_note = $(textarea_area_element_note).val();
        var temp_ruolo = $(textarea_area_element_ruolo).val();
        var temp_bluff = $(textarea_area_element_bluff).val();
        if ( typeof temp_note !== 'undefined' || temp_ruolo !== 'undefined' || temp_bluff!== 'undefined'){
            var check = true;
            for(var j = 0; j < l.length; j++){
                if(l[j][0] === tempNick.replace(" ", "_")){
                    if ( l.length <= 2 ){
                        l[j].splice(2, 0, temp_note);
                        l[j].splice(4, 0 ,temp_ruolo);
                        l[j].splice(5, 0 ,temp_bluff);
                    }
                    else{
                        l[j][2] = temp_note;
                        if ( l.length <= 4 ){
                            l[j].splice(4, 0 ,temp_ruolo);
                            l[j].splice(5, 0 ,temp_bluff);
                        }else{
                            l[j][4] = temp_ruolo;
                            if ( l.length <= 5 ){
                                l[j].splice(5, 0 ,temp_bluff);
                            }else{
                                l[j][5] = temp_bluff;
                            }
                        }
                    }
                    check = false;
                    break;
                }
            }
            if (check){
                // Controllo che non sia una nuova informazione
                new_value_with_note = [tempNick.replace(" ", "_"), "", temp_note, "", temp_ruolo];
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
            if( typeof element_list[3] !== 'undefined' && element_list[3] !== ''){
                // Restituisce il colore impostato
                return element_list[3];
            }else{
                // Colore di default
                return "#AAC";
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
            if (cookie_element.length >= 4){
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

function link_to_player_tag(){
    var lista = document.getElementsByClassName('avatar');
    var search = [];
    var lista_nick_link = [];
    for (var i = 0; i < lista.length; i++) {
        var tempCard = lista[i].getElementsByClassName('avatar_name');
        var tempNick = $(tempCard).children('a.nowrap').text();
        search.push(tempNick.replace(" ", "_"));
        var tempNick_link = $(tempCard).children('a.nowrap').attr('href');
        lista_nick_link.push(tempNick_link);
    }

    var lista_mex = document.getElementsByClassName('chat_message');
    for (i=0; i<lista_mex.length; i++){
        var text_mex = $(lista_mex[i]).text();
        for(var j = 0; j<search.length; j++){
            var nick_tag = "@"+search[j].replace(" ", "_");
            var author_mex = text_mex.split(":")[1].substring(4);
            //var auth_num = search.indexOf(message_author.replace(" ", "_"));
            //var message_with_link = text_mex.replace(message_author, "<a href='"+ lista_nick_link[auth_num] +"'>"+ message_author +"</a>");
            //var message_with_link = text_mex.replace(nick_tag, "<a href='"+ lista_nick_link[j] +"'>"+ nick_tag +"</a>");
            if (text_mex.indexOf(nick_tag) >= 0 && $(lista_mex[i]).children('a').text() != nick_tag ){
                message_with_link = text_mex.replace(nick_tag, "<a href='"+ lista_nick_link[j] +"'>"+ nick_tag +"</a>");
                $( lista_mex[i] ).html( message_with_link );
            }
        }
    }
}

function trusis_helper_ruoli( l ){
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
                    if( typeof l[j][4] !== 'undefined'){
                        note = l[j][4];
                    }else{
                        note = "";
                    }
                    break;
                }
            }

        stringHtml += '<div style="display: flex; flex-grow: 1; width: 100%; list-style-type: none;">'
            + '<li style="flex-grow: 1; vertical-align:middle; padding-left:10px; padding-top:5px; width: 30px;">'
            + '<a href="'+tempNick_link+'">'+tempNick+'</a>'
            + '</li><li style="flex-grow: 3; vertical-align:middle; padding-left:10px; padding-right: 20px; margin-top:-2px; ">'
            + '<textarea class="trusis_helper_ruoli" id="ruoli_'
            + tempNick.replace(" ", "_")
            + '" style="resize:none; width: 100%; border-radius: 10px; background-color: #346; padding-left: 10px; color: #CDF; margin: 0px 0px -20px 0px;">'
            + note
            + '</textarea></li></div><br>';
    }
    return stringHtml;
}

function trusis_helper_bluff( l ){
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
        var bluff = "";
        for(var j = 0; j < l.length; j++){
            if( l[j].length >2 && l[j][0] === tempNick.replace(" ", "_")){
                if( typeof l[j][5] !== 'undefined'){
                    bluff = l[j][5];
                }else{
                    bluff = "";
                }
                break;
            }
        }

        stringHtml += '<div style="display: flex; flex-grow: 1; width: 100%; list-style-type: none;">'
            + '<li style="flex-grow: 1; vertical-align:middle; padding-left:10px; padding-top:5px; width: 30px;">'
            + '<a href="'+tempNick_link+'">'+tempNick+'</a>'
            + '</li><li style="flex-grow: 3; vertical-align:middle; padding-left:10px; padding-right: 20px; margin-top:-2px; ">'
            + '<textarea class="trusis_helper_ruoli" id="bluff_'
            + tempNick.replace(" ", "_")
            + '" style="resize:none; width: 100%; border-radius: 10px; background-color: #346; padding-left: 10px; color: #CDF; margin: 0px 0px -20px 0px;">'
            + bluff
            + '</textarea></li></div><br>';
    }
    return stringHtml;
}

function trusis_helper_navbar (){
    var link_helper_bar_ico = "https://raw.githubusercontent.com/Jacopo1891/Trusis_Helper/master/img/trusis_helper_info.png";
    var helper_navbar = '<img src="'+ link_helper_bar_ico +'" alt="Helper_Info" title="Trusis Helper Info" style="" class="mobile_menu_item" id="info_trusis_helper">';
    var html_trusis_bar = document.getElementById('functionBar');
    $( html_trusis_bar ).append( helper_navbar );

}
