'use strict'

import { Koffing } from './koff.mjs';

//Thanks a lot to @joezhuu for these brilliant changes
const urlParams = new URLSearchParams(window.location.search);
document.getElementById('playerName').value = urlParams.get('player');
document.getElementById('trainerName').value = urlParams.get('trainer');
document.getElementById('teamName').value = urlParams.get('team');
document.getElementById('switchName').value = urlParams.get('switch');
document.getElementById('playerId').value = urlParams.get('id');
document.getElementById('birth').value = urlParams.get('dob');
if (urlParams.get('age')){
    document.getElementById(urlParams.get('age')).checked = true;
}
if (urlParams.get('lang')){
    document.getElementById(urlParams.get('lang')).checked = true;
}

const langFiles = [
    "./Resources/Pokes/Pokes",
    "./Resources/Abilities/Abilities",
    "./Resources/Items/Items",
    "./Resources/Moves/Moves",
    "./Resources/Types/Types"];

const langs = ['Chs', 'Cht', 'En', 'Es', 'Fre', 'Ger', 'Ita', 'Jpn', 'Kor'];

for (let i = 0; i < langs.length; i++) {
    for (let z = 0; z < langFiles.length; z++) {
        var myScript = document.createElement('script');
        myScript.setAttribute('src', langFiles[z] + langs[i] + '.js');
        document.head.appendChild(myScript);
    }
}

const button = document.getElementById('print');
const sheets = document.getElementsByName('sheet');

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

function sheetChange(event) {

    if (event.target.id == "reg"){
        var langInputs = document.querySelectorAll("#listLang input");
        for (const element of langInputs) {
          element.setAttribute("type", "checkbox");
          element.checked = true;
        }

        var spanTags = document.querySelectorAll('#listLang .dot');
        for (const element of spanTags) {
            element.style.borderRadius  = 0;
        }

        var spanTags = document.querySelectorAll('#listLang .option');
        for (const element of spanTags) {
            element.classList.add("cb");
        }
    } else {
        var langInputs = document.querySelectorAll("#listLang input");
        for (const element of langInputs) {
            element.setAttribute("type", "radio");
        }

        var spanTags = document.querySelectorAll('#listLang .dot');
        for (const element of spanTags) {
            element.style.borderRadius  = "50%";
        }

        var spanTags = document.querySelectorAll('#listLang .option');
        for (const element of spanTags) {
            element.classList.remove("cb");
        }
    }

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
    var chosenLang = document.querySelectorAll('input[name="radioLang"]:checked');

    for (var sheet of sheets) {
        if (sheet.checked){
            sheet = sheet.value;
            break;
        }
    }

    if (!sheet){
        document.getElementById('error').innerText = 'NO TEAM LIST SELECTED';
        return
    }
    else if (!paste) {
        document.getElementById('error').innerText = 'NO PASTE DETECTED';
        return
    }
    else if (chosenLang.length === 0){
        document.getElementById('error').innerText = 'NO LANGUAGE SELECTED';
        return
    }




    var parsedTeam = Koffing.parse(paste);

    const doc = new jsPDF();

    if (sheet == 'open' || sheet == 'close'){
        chosenLang = chosenLang[0].value;

        if (chosenLang == 'Cht' || chosenLang == 'Chs') {
            doc.addFileToVFS("customFont.ttf", fontCh);
            doc.addFont('customFont.ttf', 'customFont', 'normal');
            doc.setFont("customFont", 'normal');
        }
        else if (chosenLang == 'Jpn') {
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

        doc.addFileToVFS("text1.ttf", text1);
        doc.addFont('text1.ttf', 'text1', 'normal');
        doc.addFileToVFS("text2.ttf", text2);
        doc.addFont('text2.ttf', 'text2', 'normal');
        doc.addFileToVFS("text3.ttf", text3);
        doc.addFont('text3.ttf', 'text3', 'normal');

        doc.setFontSize(7);
        doc.setFont("text2", 'normal');
        var msg = "All Pokémon must be listed exactly as they appear in the Battle Team,";
        doc.text(50, 272, msg);

        doc.setFont("text1", 'normal');
        var msg = "at the level they are in the game.";
        doc.text(120.5, 272, msg);

        doc.setFontSize(13);
        doc.setFont("text1", 'normal');
        var msg = "Pokémon Video Game Team List";
        doc.text(73, 12.5, msg);

        doc.setLineWidth(0.3);
        var x = 45;
        var y = 34.5;
        var mygap = 7;
        for (let i = 0; i < 4; i++) {
            doc.line(x, y+mygap*i, x+65, y+mygap*i);
        }

        doc.setFontSize(12);
        doc.setFont("text1", 'normal');

        var msg = "Player Name: ";
        doc.text(45, 33, msg, "right");

        doc.setFontSize(9);

        var msg = "Trainer Name in Game: ";
        doc.text(45, 40, msg, "right");

        var msg = "Battle Team Number / Name: ";
        doc.text(45, 47, msg, "right");

        var msg = "Switch Profile Name: ";
        doc.text(45, 54, msg, "right");

        var x = 155;
        var gapx = 21;
        for (let i = 0; i < 3; i++) {
            doc.rect(x + gapx * i, 30, 4, 4);
        }

        var msg = "Age Division: ";
        doc.text(140, 33, msg, "right");
        var msg = "Juniors ";
        doc.text(154, 33, msg, "right");
        var msg = "Seniors ";
        doc.text(175, 33, msg, "right");
        var msg = "Masters ";
        doc.text(196, 33, msg, "right");

        doc.setFont("text2", 'normal');
        doc.setFontSize(13);
        doc.text(playerName, 47, 33);
        doc.text(trainerName, 47, 40);
        doc.text(teamName, 47, 47);
        doc.text(switchName, 47, 54);

        for (let i = 0; i < 6; i++) {
            doc.setLineWidth(0.6);
            var x = 6.5 + 99 * (i%2);
            var y = 59.5 + 70 * Math.floor(i/2);
            doc.rect(x, y, 95, 68);

            doc.setLineWidth(0.4);
            var startY = 12;
            var mygap = 8;
            for (let b = 0; b < 7; b++) {
                doc.line(x, y+startY+mygap*b, x+95, y+startY+mygap*b);
            }
        }

        if (ageDivision) {
            ageDivision = ageDivision.value;
            doc.setLineWidth(1);
            var posX = 154 + 21 * ageDivision;
            doc.line(posX, 29, posX+6, 35);
            doc.line(posX+6, 29, posX, 35);
        }

        var pokes = parsedTeam.teams[0].pokemon;

        for (let i = 0; i < pokes.length; i++) {

            var textX = 35;
            var statX = 100;
            var gapX = 100;
            var textXX = 27.5;

            var pokeY = 67;
            var teraY = pokeY + 9.5;
            var levelY = pokeY + 9.5;
            var abilityY = pokeY + 18;
            var itemY = pokeY + 26;
            var gapY = 70;

            var moveY = pokeY + 34;
            var moveGapY = 8;

            var statY = pokeY + 19;
            var statGapY = 8;

            var nameId = PokeTranslator[pokes[i].name];
            var abilityId = AbilityTranslator[pokes[i].ability];
            var teraTypeId = TypeTranslator[pokes[i].teraType];

            var itemId = 'NOITEM';
            if (pokes[i].item){
                itemId = ItemTranslator[pokes[i].item];
            }

            var nature = 'Serious';
            if (pokes[i].nature){
                nature = pokes[i].nature;
            }

            var level = 100;
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

            var name = window['pokes' + chosenLang][nameId];
            var teraType = window['types' + chosenLang][teraTypeId];
            var ability = window['abilities' + chosenLang][abilityId];
            var item = 'NO ITEM';
            if (itemId != 'NOITEM'){
                item = window['items' + chosenLang][itemId];
            }
            var movs = [];
            for (let x = 0; x < pokes[i].moves.length; x++){
                var moveId = MoveTranslator[pokes[i].moves[x]];
                movs.push(window['moves' + chosenLang][moveId]);
            }

            doc.setFontSize(13);
            doc.setFont("text1", 'normal');
            doc.text("Pokémon", textXX + (i%2) * gapX, pokeY + (Math.floor(i/2)) * gapY, "right");
            doc.setFontSize(12);
            doc.setFont("customFont", 'normal');
            doc.text(name, textX + (i%2) * gapX, pokeY + (Math.floor(i/2)) * gapY);

            doc.setFontSize(13);
            doc.setFont("text1", 'normal');
            doc.text("Tera Type", textXX + (i%2) * gapX, teraY + (Math.floor(i/2)) * gapY, "right");
            doc.setFontSize(11);
            doc.setFont("customFont", 'normal');
            doc.text(teraType, textX + (i%2) * gapX, teraY + (Math.floor(i/2)) * gapY);

            doc.setFontSize(13);
            doc.setFont("text1", 'normal');
            doc.text("Ability", textXX + (i%2) * gapX, abilityY + (Math.floor(i/2)) * gapY, "right");
            doc.setFontSize(11);
            doc.setFont("customFont", 'normal');
            doc.text(ability, textX + (i%2) * gapX, abilityY + (Math.floor(i/2)) * gapY);

            doc.setFontSize(13);
            doc.setFont("text1", 'normal');
            doc.text("Held Item", textXX + (i%2) * gapX, itemY + (Math.floor(i/2)) * gapY, "right");
            doc.setFontSize(11);
            doc.setFont("customFont", 'normal');
            doc.text(item, textX + (i%2) * gapX, itemY + (Math.floor(i/2)) * gapY);

            for (let j = 0; j < movs.length; j++) {
                doc.setFontSize(13);
                doc.setFont("text1", 'normal');
                doc.text("Move " + (j+1), textXX + (i%2) * gapX, moveY + (Math.floor(i/2)) * gapY + j * moveGapY, "right");
                doc.setFontSize(11);
                doc.setFont("customFont", 'normal');
                doc.text(movs[j], textX + (i%2) * gapX, moveY + (Math.floor(i/2)) * gapY + j * moveGapY);
            }



            if (sheet == "close") {
                console.log(pokes[i].name, ivs, evs, level, nature, i);
                var stats = getStats(pokes[i].name, ivs, evs, level, nature);

                doc.text(level.toString(), statX + (i%2) * (gapX-1), levelY + (Math.floor(i/2)) * gapY, 'right');

                var j = 0;
                for (const [key, value] of Object.entries(stats)){
                    doc.text(value.toString(), statX + (i%2) * (gapX-1), statY + (Math.floor(i/2)) * gapY + j * statGapY, 'right');

                    j = j + 1;
                }
            }
        }
    }

    if (sheet == 'open') {
        doc.setFontSize(13);
        doc.setFont("text1", 'normal');
        var msg = "2 of 2: ";
        doc.text(83, 18, msg);

        doc.setFont("text3", 'normal');
        var msg = "For Opponents";
        doc.text(96, 18, msg);

        doc.setFontSize(10);
        doc.setFont("text3", 'normal');
        var msg = "Do not lose this page! Keep it throughout the tournament, sharing it with your opponent each round.";
        doc.text(31, 24, msg);

        doc.save(playerId+"-OTS.pdf");

    }

    if (sheet == 'close') {
        doc.setFontSize(13);
        doc.setFont("text1", 'normal');
        var msg = "1 of 2: ";
        doc.text(77, 18, msg);

        doc.setFont("text3", 'normal');
        var msg = "For Tournament Staff";
        doc.text(90, 18, msg);

        doc.setFontSize(10);
        doc.setFont("text3", 'normal');
        var msg = "Complete both pages of this document. Submit this page to event staff before the tournament, at the time set by the Organizer.";
        doc.text(12, 24, msg);

        doc.setLineWidth(0.3);
        doc.setFontSize(9);
        doc.setFont("text1", 'normal');
        var msg = "Player ID: ";
        doc.text(140, 43, msg, "right");
        doc.line(140, 44.5, 180, 44.5);
        doc.setFontSize(13);
        doc.setFont("text2", 'normal');
        doc.text(playerId, 142, 43);

        doc.setFontSize(9);
        doc.setFont("text1", 'normal');
        var msg = "Date of Birth: ";
        doc.text(140, 51, msg, "right");
        doc.line(140, 52.5, 180, 52.5);
        doc.setFontSize(13);
        doc.setFont("text2", 'normal');
        doc.text(birth, 142, 51);


        for (let i = 0; i < 6; i++) {
            doc.setLineWidth(0.4);
            var x = 6.5 + 99 * (i%2);
            var y = 59.5 + 70 * Math.floor(i/2);

            doc.line(x+80, y+12, x+80, y+68);
            doc.setFontSize(6);
            doc.setFont("text1", 'normal');
            doc.text(x+81, y+14, "Level");
            doc.text(x+81, y+22, "HP");
            doc.text(x+81, y+30, "Atk");
            doc.text(x+81, y+38, "Def");
            doc.text(x+81, y+46, "Sp. Atk");
            doc.text(x+81, y+54, "Sp. Def");
            doc.text(x+81, y+62, "Speed");
        }

        doc.setFontSize(11);
        doc.setFont("customFont", 'normal');


        doc.save(playerId+"-staff.pdf");

    }

    if (sheet == 'reg') {

        /*var startX = 10;
        var startY = 35;
        var colGap = (210 - 2*startX)/6;
        var langGap = (297-startY) / chosenLang.length;

        doc.setFontSize(12);

        for (let i = 0; i<7; i++) {
            doc.setLineWidth(0.5);
            doc.line(startX+colGap*i, startY - 0.25, startX+colGap*i, startY+252);
        }
        for(let i = 0; i < chosenLang.length; i++){
            doc.setLineWidth(0.5);
            doc.line(startX, startY + i * langGap, startX+190, startY + i * langGap);
        }

        for (let i = 0; i<6; i++) {
            doc.text(startX+32*i, startY+25, "espechan");
        }*/

        var pokes = parsedTeam.teams[0].pokemon;
        doc.addFileToVFS("customFont.ttf", fontLatin);
        doc.addFont('customFont.ttf', 'customFont', 'normal');
        doc.setFont("customFont", 'normal');

        doc.addFileToVFS("customFont.ttf", fontJpn);
        doc.addFont('customFont.ttf', 'customFont', 'normal');
        doc.setFont("customFont", 'normal');

        doc.addFileToVFS("customFont.ttf", fontKor);
        doc.addFont('customFont.ttf', 'customFont', 'normal');
        doc.setFont("customFont", 'normal');

        const canvas = document.createElement('canvas');
        canvas.width = 100;
        canvas.height = 100;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, 100, 100);
        const line = canvas.toDataURL();

        doc.setFontSize(14);
        doc.text(playerName+" - "+trainerName, 20, 8, 'left');
        doc.text(ageDivision.id, 199, 11, 'right');

        let c_width=190/7;
        const ygap=3.8;
        const ystart_l=15;

        for (let j=0;j<9;j++) {


            doc.addImage({imageData:line, format:'png', x:9, y:ystart_l+j*8*ygap, width:190, height:0.4});

            for (let i=0;i<7;i++) {
                doc.addImage({imageData:line, format:'png', x:9, y:ystart_l+(i+1)*ygap+j*8*ygap, width:190, height:0.1});
            }
        }
        doc.addImage({imageData:line, format:'png', x:9, y:ystart_l+72*ygap, width:190, height:0.5});
        for (let i=0;i<8;i++) {
            doc.addImage({imageData:line, format:'png', x:9+c_width*i, y:15, width:0.1, height:273.6});
        }

        const gui = {
            "En": {
                "item": " Held Item",
                "ability": "Ability",
                "teratype": "Teratype",
                "lg":"EN",
                "move":"Move"
            },
            "Es": {
                "item": "Objeto equipado",
                "ability": "Habilidad",
                "teratype": "Teratipo",
                "lg":"ES",
                "move":"Movimento"
            },
            "Ita": {
                "item": "Strumento tenuto",
                "ability": "Abilit\u00e0",
                "teratype": "Teratipo",
                "lg":"IT",
                "move":"Mossa"
            },
            "Ger": {
                "item": "Getragenes Item",
                "ability": "F\u00e4higkeit",
                "teratype": "Tera-Typ",
                "lg":"DE",
                "move":"Attacke"
            },
            "Fre": {
                "item": "Objet tenu",
                "ability": "Talent",
                "teratype": "Type T\u00e9racristal",
                "lg":"FR",
                "move":"Capacit\u00e9"
            },
            "Jpn":{
                "item":"\u3082\u3061\u3082\u306e",
                "ability": "\u9053\u5177",
                "teratype":"\u30c6\u30e9\u30bf\u30a4\u30d7",
                "lg":"JP",
                "move":"\u30ef\u30b6"
            },
            "Kor":{
                "item": "\uc544\uc774\ud15c",
                "ability": "\ud2b9\uc131",
                "teratype": "\ud14c\ub77c\uc2a4\ud0c8\ud0c0\uc785",
                "lg":"KO",
                "move":"\uae00\uc218"
            },
            "Chs":{
                "item": "\u6301\u6709\u7269\u54c1",
                "ability": "\u80fd\u529b",
                "teratype": "\u592a\u62c9\u578b",
                "lg":"SC",
                "move":"\u52a8\u4f5c"
            },
            "Cht":{
                "item": "\u6301\u6709\u7269\u54c1",
                "ability": "\u80fd\u529b",
                "teratype": "\u592a\u62c9\u578b",
                "lg":"TC",
                "move":"\u52d5\u4f5c"
            }
        }

       var langValues= [];
       for (let i = 0; i < chosenLang.length; i++) {
        langValues.push(chosenLang[i].value);
       }

        var langcheck = ["En","Fre","Ita","Ger","Es","Jpn","Kor","Chs","Cht"];
        for (let u = 0; u < langcheck.length; u++) {

            var currentLang = langcheck[u];

            if (langValues.includes(currentLang)) {

                if (currentLang == "Chs" || currentLang == "Cht" || currentLang == "Jpn") {
                    doc.addFileToVFS("customFont.ttf", fontCh);
                    doc.addFont('customFont.ttf', 'customFont', 'normal');
                    doc.setFont("customFont", 'normal');
                }
                else if (currentLang == "Kor") {
                    doc.addFileToVFS("customFont.ttf", fontKor);
                    doc.addFont('customFont.ttf', 'customFont', 'normal');
                    doc.setFont("customFont", 'normal');
                }


                const ystart=18.6;
                doc.setFontSize(10);
                doc.text(gui[currentLang]["lg"], 10, ystart+ygap*8*u, 'left');
                doc.text("Pok\u00e9mon", 24, ystart+ygap*8*u, 'center');
                doc.text(gui[currentLang]["teratype"], 22, ystart+ygap+ygap*8*u, 'center');
                doc.text(gui[currentLang]["ability"], 22, ystart+ygap*2+ygap*8*u, 'center');
                doc.setFontSize(9);
                doc.text(gui[currentLang]['item'], 22, ystart+ygap*3+ygap*8*u,"center");
                doc.setFontSize(10);
                doc.text(gui[currentLang]['move']+" 1", 22, ystart+ygap*4+ygap*8*u,"center");
                doc.text(gui[currentLang]['move']+" 2", 22, ystart+ygap*5+ygap*8*u,"center");
                doc.text(gui[currentLang]['move']+" 3", 22, ystart+ygap*6+ygap*8*u,"center");
                doc.text(gui[currentLang]['move']+" 4", 22, ystart+ygap*7+ygap*8*u,"center");
                doc.setFont("customFont", 'normal');


                for (let i = 0; i < pokes.length; i++) {
                    var id = PokeTranslator[pokes[i].name];
                    var pokeFontSize=10;
                    var pokeTextWidth= doc.getStringUnitWidth(window['pokes' + currentLang][id])*10;
                    while (pokeTextWidth>80) {
                        pokeFontSize-=0.5;
                        doc.setFontSize(pokeFontSize);
                        pokeTextWidth= doc.getStringUnitWidth(window['pokes' + currentLang][id])*pokeFontSize;
                    }
                    doc.text(window['pokes' + currentLang][id], 22+c_width*(i+1), ystart+8*ygap*u,"center");
                    doc.setFontSize(10);
                    id = TypeTranslator[pokes[i].teraType];
                    doc.text(window['types' + currentLang][id], 22+c_width*(i+1), ystart+ygap+8*ygap*u,"center");
                    id = AbilityTranslator[pokes[i].ability];
                    var abilityFontSize=10;
                    var abilityTextWidth= doc.getStringUnitWidth(window['abilities' + currentLang][id])*10;
                    while (abilityTextWidth>78) {
                        abilityFontSize-=0.5;
                        doc.setFontSize(abilityFontSize);
                        abilityTextWidth= doc.getStringUnitWidth(window['abilities' + currentLang][id])*abilityFontSize;
                    }
                    doc.text(window['abilities' + currentLang][id], 22+c_width*(i+1), ystart+2*ygap+8*ygap*u,"center");
                    doc.setFontSize(10);
                    id = ItemTranslator[pokes[i].item];
                    var itemFontSize=10;
                    var itemTextWidth= doc.getStringUnitWidth(window['items' + currentLang][id])*10;
                    while (itemTextWidth>78) {
                        itemFontSize-=0.5;
                        doc.setFontSize(itemFontSize);
                        itemTextWidth= doc.getStringUnitWidth(window['items' + currentLang][id])*itemFontSize;
                    }
                    doc.text(window['items' + currentLang][id], 22+c_width*(i+1), ystart+3*ygap+8*ygap*u,"center");
                    doc.setFontSize(10);
                    for (let x = 0; x < pokes[i].moves.length; x++){
                        var moveId = MoveTranslator[pokes[i].moves[x]];
                        var moveFontSize=10;
                        var moveTextWidth= doc.getStringUnitWidth(window['moves' + currentLang][moveId])*10;
                        while (moveTextWidth>78) {
                            moveFontSize-=0.5;
                            doc.setFontSize(moveFontSize);
                            moveTextWidth= doc.getStringUnitWidth(window['moves' + currentLang][moveId])*moveFontSize;
                        }
                        doc.text(window['moves' + currentLang][moveId], 22+c_width*(i+1), ystart+4*ygap+30.4*u+ygap*x,"center");
                        doc.setFontSize(10);
                    }

                }
            }
        }


        doc.save(playerId+"-reg.pdf");
    }

////    var img = new Image()
////    img.src = './Resources/imgs/' + sheet + '.png';
////    doc.addImage({imageData:img, format:'png', x:0, y:0, width:210, height:297});


}

button.addEventListener('click', generatePdf);
for (const element of sheets) {
    element.addEventListener('change', sheetChange);
}

document.getElementById("open").checked = true;
window.generatePdf = generatePdf;
window.jsPDF = window.jspdf.jsPDF;
