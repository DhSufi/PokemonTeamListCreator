'use strict'

import { Koffing } from './koff.mjs';

const langFiles = [
    "./Resources/Pokes/Pokes",
    "./Resources/Abilities/Abilities",
    "./Resources/Items/Items",
    "./Resources/Moves/Moves",
    "./Resources/Types/Types"];

const langs = ['Chs', 'Cht', 'En', 'Es', 'Fre', 'Ger', 'Ita', 'Jpn', 'JpnKanji', 'Kor'];

for (let i = 0; i < langs.length; i++) {
    for (let z = 0; z < langFiles.length; z++) {
        var myScript = document.createElement('script');
        myScript.setAttribute('src', langFiles[z] + langs[i] + '.js');
        document.head.appendChild(myScript);
    }
}

function getStats(poke, ivs, evs, level, nat) {

    var ret = {'hp': 0, 'atk': 0, 'def': 0, 'spa': 0, 'spd': 0, 'spe': 0};

    var baseStats = pokedex[poke];
    var nature = natures[nat];

    for (const [key, value] of Object.entries(baseStats)){
        if (key == 'hp'){
            var stat = Math.floor(((((2 * baseStats.hp) + (evs.hp/4) + ivs.hp) * level)/100) + level + 10);
            ret['hp'] = stat;
        } else {
            var stat = Math.floor(Math.floor((((((2 * baseStats[key]) + (evs[key]/4) + ivs[key]) * level) / 100) + 5)) * nature[key]);
            ret[key] = stat;
        }
    }

    return ret

}

function generatePdf(element) {

    document.getElementById('error').innerText = '';

    var playerName = document.getElementById('playerName').value;
    var trainerName = document.getElementById('trainerName').value;
    var teamName = document.getElementById('teamName').value;
    var switchName = document.getElementById('switchName').value;
    var playerId = document.getElementById('playerId').value;
    var birth = document.getElementById('birth').value;
    var paste = document.getElementById('paste').value;
    var ageDivision = document.querySelector('input[name="ageDivision"]:checked');
    var sheet = document.querySelector('input[name="sheet"]:checked');
    var chosenLang = document.querySelector('input[name="radioLang"]:checked');

    if (!sheet){
        document.getElementById('error').innerText = 'NO TEAM LIST SELECTED';
        return
    }
    else if (!chosenLang) {
        document.getElementById('error').innerText = 'NO LANGUAGE SELECTED';
        return
    }
    else if (!paste) {
        document.getElementById('error').innerText = 'NO PASTE DETECTED';
        return
    }

    sheet = sheet.value;
    chosenLang = chosenLang.value;


    const doc = new jsPDF();

    if (chosenLang == 'Cht' || chosenLang == 'Chs') {
        doc.addFileToVFS("customFont.ttf", fontCh);
        doc.addFont('customFont.ttf', 'customFont', 'normal');
        doc.setFont("customFont", 'normal');
    }
    else if (chosenLang == 'Jpn' || chosenLang == 'JpnKanji') {
        doc.addFileToVFS("customFont.ttf", fontJpn);
        doc.addFont('customFont.ttf', 'customFont', 'normal');
        doc.setFont("customFont", 'normal');
    }
    else if (chosenLang == 'Kor') {
        doc.addFileToVFS("customFont.ttf", fontKor);
        doc.addFont('customFont.ttf', 'customFont', 'normal');
        doc.setFont("customFont", 'normal');
    }
    else {
        doc.addFileToVFS("customFont.ttf", fontLatin);
        doc.addFont('customFont.ttf', 'customFont', 'normal');
        doc.setFont("customFont", 'normal');
    }

    doc.setFontSize(10);
    doc.text(playerName, 51, 41);
    doc.text(trainerName, 51, 48);
    doc.text(teamName, 51, 56);
    doc.text(switchName, 51, 64);
    if (sheet == 'close') {
        doc.text(playerId, 150, 49);
        doc.text(birth, 150, 56);
    }


    var img = new Image()
    img.src = './Resources/imgs/' + sheet + '.png';
    doc.addImage({imageData:img, format:'png', x:0, y:0, width:210, height:297});

    if (ageDivision) {
        ageDivision = ageDivision.value;
        var img = new Image()
        img.src = './Resources/imgs/check.png';
        var posX = 160 + 18 * ageDivision;
        doc.addImage({imageData:img, format:'png', x:posX, y:38, width:5.4, height:5.6});
    }

    var parsedTeam = Koffing.parse(paste);

    var pokes = parsedTeam.teams[0].pokemon;

    for (let i = 0; i < pokes.length; i++) {

        var textX = 35;
        var statX = 100;
        var gapX = 100;

        var pokeY = 75;
        var teraY = 84;
        var levelY = 84;
        var abilityY = 92;
        var itemY = 100.5;
        var gapY = 70;

        var moveY = 109;
        var moveGapY = 7.5;

        var statY = 92;
        var statGapY = 8;


        var nameId = PokeTranslator[pokes[i].name];
        var abilityId = AbilityTranslator[pokes[i].ability];
        var itemId = ItemTranslator[pokes[i].item];
        var teraTypeId = TypeTranslator[pokes[i].teraType];

        var nature = 'Serious';
        if (pokes[i].nature){
            nature = pokes[i].nature;
        }

        var level = 50;
        if (pokes[i].level){
            level = pokes[i].level;
        }

        var ivs = {'hp': 31, 'atk': 31, 'def': 31, 'spa': 31, 'spd': 31, 'spe': 31};
        if (pokes[i].ivs) {
            for (const [key, value] of Object.entries(pokes[i].ivs)){
                ivs[key] = value;
            }
        }

        var evs = {'hp': 0, 'atk': 0, 'def': 0, 'spa': 0, 'spd': 0, 'spe': 0};
        if (pokes[i].evs){
            for (const [key, value] of Object.entries(pokes[i].evs)){
                evs[key] = value;
            }
        }

        if (!pokedex[pokes[i].name]){
            document.getElementById('error').innerText = 'ERROR IN PASTE';
            return;
        }

        var stats = getStats(pokes[i].name, ivs, evs, level, nature);

        var name = window['pokes' + chosenLang][nameId];
        var teraType = window['types' + chosenLang][teraTypeId];
        var ability = window['abilities' + chosenLang][abilityId];
        var item = window['items' + chosenLang][itemId];
        var movs = [];
        for (let x = 0; x < pokes[i].moves.length; x++){
            var moveId = MoveTranslator[pokes[i].moves[x]];
            movs.push(window['moves' + chosenLang][moveId]);
        }

        doc.text(name,     textX + (i%2) * gapX, pokeY + (Math.floor(i/2)) * gapY);
        doc.text(teraType, textX + (i%2) * gapX, teraY + (Math.floor(i/2)) * gapY);
        doc.text(ability,  textX + (i%2) * gapX, abilityY + (Math.floor(i/2)) * gapY);
        doc.text(item,     textX + (i%2) * gapX, itemY + (Math.floor(i/2)) * gapY);

        for (let j = 0; j < movs.length; j++) {
            doc.text(movs[j], textX + (i%2) * gapX, moveY + (Math.floor(i/2)) * gapY + j * moveGapY);
        }

        if (sheet == 'close') {

            doc.text(level.toString(),    statX + (i%2) * gapX, levelY + (Math.floor(i/2)) * gapY, 'right');

            var j = 0;
            for (const [key, value] of Object.entries(stats)){
                doc.text(value.toString(), statX + (i%2) * gapX, statY + (Math.floor(i/2)) * gapY + j * statGapY, 'right');
                j = j + 1;
            }
        }

    }

    doc.save("SufiTest.pdf");
}

window.generatePdf = generatePdf;
window.jsPDF = window.jspdf.jsPDF;
