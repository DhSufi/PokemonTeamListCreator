const { Teams } = window.pkmn.sets;
const { jsPDF } = window.jspdf;


class PdfGenerator {

    static #FONTS = [
        {family: "NotoSansTC", file: "NotoSansTC-Regular.ttf", style: "regular"},
        {family: "NotoSansTC", file: "NotoSansTC-Bold.ttf", style: "bold"},
        {family: "NotoSansSC", file: "NotoSansSC-Regular.ttf", style: "regular"},
        {family: "NotoSansSC", file: "NotoSansSC-Bold.ttf", style: "bold"},
        {family: "NotoSansJP", file: "NotoSansJP-Regular.ttf", style: "regular"},
        {family: "NotoSansJP", file: "NotoSansJP-Bold.ttf", style: "bold"},
        {family: "NotoSansKR", file: "NotoSansKR-Regular.ttf", style: "regular"},
        {family: "NotoSansKR", file: "NotoSansKR-Bold.ttf", style: "bold"},
        {family: "NotoSans", file: "NotoSans-Regular.ttf", style: "regular"},
        {family: "NotoSans", file: "NotoSans-Bold.ttf", style: "bold"},
        {family: "NotoSans", file: "NotoSans-BoldItalic.ttf", style: "bolditalic"}
    ];

    static #ROWORDER = { 
        0: {title: "pokemon", name: "pokemon"},
        1: {title: "nature", name: "nature"},
        2: {title: "ability", name: "ability"},
        3: {title: "item", name: "item"},
        4: {title: "move", name: "move1"},
        5: {title: "move", name: "move2"},
        6: {title: "move", name: "move3"},
        7: {title: "move", name: "move4"}
    };

    static #STATORDER = { 
        0: "hp",
        1: "atk",
        2: "def",
        3:"spa",
        4: "spd",
        5: "spe"
    }

    static #LOCALE = {
        "usa": {
            pokemon: "Pok\u00e9mon",
            nature: "Stat Alignment",
            ability: "Ability",
            item: "Held Item",
            move:"Move",
            teratype: "Teratype",
            lg: "EN",
            font: "NotoSans",
            tstart: 42,
            hp: "HP",
            atk: "Atk",
            def: "Def",
            spa: "Sp. Atk",
            spd:"Sp. Def",
            spe: "Speed"
        },
        "esp": {
            pokemon: "Pok\u00e9mon",
            nature: "Var. Caract.",
            ability: "Habilidad",
            item: "Objeto Eq.",
            move:"Movimento",
            teratype: "Teratipo",
            lg: "ES",
            font: "NotoSans",
            tstart: 35,
            hp: "PS",
            atk: "Ataque",
            def: "Defensa",
            spa: "At. Esp.",
            spd:"Def. Esp.",
            spe: "Velocidad"
        },
        "latam": {
            pokemon: "Pok\u00e9mon",
            nature: "Var. Caract.",
            ability: "Habilidad",
            item: "Objeto Eq.",
            move:"Movimento",
            teratype: "Teratipo",
            lg: "LATAM",
            font: "NotoSans",
            tstart: 35,
            hp: "PS",
            atk: "Ataque",
            def: "Defensa",
            spa: "At. Esp.",
            spd:"Def. Esp.",
            spe: "Velocidad"
        },
        "ita": {
            pokemon: "Pok\u00e9mon",
            nature: "Calib. Stat.",
            ability: "Abilit\u00e0",
            item: "Strumento",
            move:"Mossa",
            teratype: "Teratipo",
            lg: "IT",
            font: "NotoSans",
            tstart: 35,
            hp: "PS",
            atk: "Attacco",
            def: "Difesa",
            spa: "Att. Sp.",
            spd:"Dif. Sp.",
            spe: "Velocit\u00e0"
        },
        "deu": {
            pokemon: "Pok\u00e9mon",
            nature: "Status-Anp.",
            ability: "F\u00e4higkeit",
            item: "Getr. Item",
            move:"Attacke",
            teratype: "Tera-Typ",
            lg: "DE",
            font: "NotoSans",
            tstart: 35,
            hp: "KP",
            atk: "Angriff",
            def: "Verteidigung",
            spa: "Sp.-Ang.",
            spd:"Sp.-Vert.",
            spe: "Initiative"
        },
        "fra": {
            pokemon: "Pok\u00e9mon",
            nature: "Ajust. de stats",
            ability: "Talent",
            item: "Objet tenu",
            move:"Capacit\u00e9",
            teratype: "Type T\u00e9racristal",
            lg: "FR",
            font: "NotoSans",
            tstart: 40,
            hp: "PV",
            atk: "Attaque",
            def: "D\u00e9fense",
            spa: "Atq. Sp\u00e9.",
            spd:"D\u00e9f. Sp\u00e9.",
            spe: "Vitesse"
        },
        "jpn":{
            pokemon: "\u30dd\u30b1\u30e2\u30f3",
            nature:"\u80fd\u529b\u88dc\u6b63",
            ability: "\u9053\u5177",
            item:"\u3082\u3061\u3082\u306e",
            move:"\u30ef\u30b6",
            teratype:"\u30c6\u30e9\u30bf\u30a4\u30d7",
            lg: "JP",
            font: "NotoSansJP",
            tstart: 30,
            hp: "HP",
            atk: "\u3053\u3046\u3052\u304d",
            def: "\u307c\u3046\u304e\u3087",
            spa: "\u3068\u304f\u3053\u3046",
            spd:"\u3068\u304f\u307c\u3046",
            spe: "\u3059\u3070\u3084\u3055"
        },
        "kor":{
            pokemon: "\ud3ec\ucf13\ubaac",
            nature: "\ub2a5\ub825\u0020\ubcf4\uc815",
            ability: "\ud2b9\uc131",
            item: "\uc544\uc774\ud15c",
            move:"\uae00\uc218",
            teratype: "\ud14c\ub77c\uc2a4\ud0c8\ud0c0\uc785",
            lg: "KO",
            font: "NotoSansKR",
            tstart: 30,
            hp: "HP",
            atk: "\uacf5\uaca9",
            def: "\ubc29\uc5b4",
            spa: "\ud2b9\uc218\uacf5\uaca9",
            spd:"\ud2b9\uc218\ubc29\uc5b4",
            spe: "\uc2a4\ud53c\ub4dc"
        },
        "sch":{
            pokemon: "\u5b9d\u53ef\u68a6",
            nature: "\u80fd\u529b\u8c03\u6574",
            ability: "\u80fd\u529b",
            item: "\u6301\u6709\u7269\u54c1",
            move:"\u52a8\u4f5c",
            teratype: "\u592a\u62c9\u578b",
            lg: "SC",
            font: "NotoSansSC",
            tstart: 30,
            hp: "HP",
            atk: "\u653b\u51fb",
            def: "\u9632\u5fa1",
            spa: "\u7279\u653b",
            spd:"\u7279\u9632",
            spe: "\u901f\u5ea6"
        },
        "tch":{
            pokemon: "\u5bf6\u53ef\u5922",
            nature: "\u80fd\u529b\u8abf\u6574",
            ability: "\u80fd\u529b",
            item: "\u6301\u6709\u7269\u54c1",
            move: "\u52d5\u4f5c",
            teratype: "\u592a\u62c9\u578b",
            lg: "TC",
            font: "NotoSansTC",
            tstart: 30,
            hp: "HP",
            atk: "\u653b\u64ca",
            def: "\u9632\u79a6",
            spa: "\u7279\u653b",
            spd:"\u7279\u9632",
            spe: "\u901f\u5ea6"
        }
    }

    // TODO: ask for translations
    static #textline0 = "Pokémon Video Game Team List";
    static #textline1 = "Complete both pages of this document. Submit this page to event staff before the tournament, at the time set by the Organizer.";
    static #textline2 = "All Pokémon must be listed exactly as they appear in the Battle Team.";
    static #textline3 = "Player Name:";
    static #textline4 = "Trainer Name in Game:";
    static #textline5 = "Battle Team Number / Name:";
    static #textline6 = "Switch Profile Name:";
    static #textline7 = "Age Division:";
    static #textline8 = "Player ID:";
    static #textline9 = "Date of Birth:";
    static #textline10 = "Support ID:";
    static #textline71 = "Junior";
    static #textline72 = "Senior";
    static #textline73 = "Masters";

    static #rectWidth = 93;
    static #rectHeight = 73;
    static #offsetY = 57;
    static #numRows = 7;
    static #rectMarginTop = 3;
    static #rectMarginLeft = (210 - PdfGenerator.#rectWidth * 2) / 3;
    static #headerHeight = 12;
    static #rowHeight = (PdfGenerator.#rectHeight - PdfGenerator.#headerHeight) / PdfGenerator.#numRows;

    static #mOffsetY = 15;
    static #mBoxMarginLeft = 10;
    static #mBoxMarginTop = 2;
    static #mBoxesPerPage = 6;
    static #mBoxWidth = 210 - PdfGenerator.#mBoxMarginLeft * 2;
    static #mBoxHeight = (((297 - PdfGenerator.#mOffsetY * 2) - (PdfGenerator.#mBoxMarginTop * (PdfGenerator.#mBoxesPerPage - 1))) / PdfGenerator.#mBoxesPerPage);
    static #mColNum = 7;
    static #mRowNum = 8;
    static #mColWidth = PdfGenerator.#mBoxWidth / PdfGenerator.#mColNum;
    static #mRowHeight = PdfGenerator.#mBoxHeight / PdfGenerator.#mRowNum;

    static #cachedFonts = null;
    static #cachedBaseData = null;
    static #cachedLocaleData = {};
    static #cachedUserInput = null;
    static #cachedCurrentTeam = null;
    static #cachedTranslatedTeam = null;

    constructor(userdata) {
        // "p" or "portrait"
        // unit ("mm", "cm", "in", "px", "pt")
        // Page format "a4"
        this.doc = new jsPDF("p", "mm", "a4");
        this.pageWidth = this.doc.internal.pageSize.getWidth();
        this.pageHeight = this.doc.internal.pageSize.getHeight();
        this.centerX = this.pageWidth / 2;
        this.userdata = userdata;
    }

    calculateStats(poke) {

        let ret = { 'hp': 0, 'atk': 0, 'def': 0, 'spa': 0, 'spd': 0, 'spe': 0 };

        const base = this.baseStatValues[poke.pokemon];
        const nature = this.statsAlignmentValues[poke.nature]

        for (const [stat, value] of Object.entries(base)) {
            const ev = poke.evs[stat] || 0;
            if (stat === 'hp') {
                ret[stat] = value + 75 + ev
            } else {
                ret[stat] = Math.floor((value + 20 + ev) * nature[stat]);
            }
        }

        return ret
    }

    async #urlFetch(url) {

        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const contentType = response.headers.get("content-type") || "";

            if (contentType.includes("application/json")) {
                return await response.json();
            }

            return await response.text();

        } catch (error) {
            console.error(`Failed to fetch URL ${url}:`, error.message);

            this.userdata.error.textContent = "";
            this.userdata.error.textContent = 'ERROR, CHECK PASTE URL';
            return false;
        }

    }

    async loadTranslators() {
        if (!PdfGenerator.#cachedBaseData) {
            const [
                baseStatValues,
                statsAlignmentValues,
                translatorPokes,
                translatorMoves,
                translatorItems,
                translatorAbilities,
                translatorStatsAlignments
            ] = await Promise.all([
                this.#urlFetch("./Resources/Stats/stats_base.json"),
                this.#urlFetch("./Resources/Stats/stats_alignment_values.json"),
                this.#urlFetch("./Resources/Pokes/translator_pokes.json"),
                this.#urlFetch("./Resources/Moves/translator_moves.json"),
                this.#urlFetch("./Resources/Items/translator_items.json"),
                this.#urlFetch("./Resources/Abilities/translator_abilities.json"),
                this.#urlFetch("./Resources/Stats/translator_stat_alignment.json")
            ]);

            PdfGenerator.#cachedBaseData = {
                baseStatValues,
                statsAlignmentValues,
                translatorPokes,
                translatorMoves,
                translatorItems,
                translatorAbilities,
                translatorStatsAlignments
            };
        }

        Object.assign(this, PdfGenerator.#cachedBaseData);
    }


    async #fetchFontAsBase64(url) {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Font fetch failed: ${response.status}`);
        const blob = await response.blob();

        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(",")[1]);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }

    async loadAllFonts() {
        if (!PdfGenerator.#cachedFonts) {
            PdfGenerator.#cachedFonts = await Promise.all(
                PdfGenerator.#FONTS.map(async (font) => {
                    const base64 = await this.#fetchFontAsBase64(`./Resources/Fonts/${font.file}`);
                    return { ...font, base64 };
                })
            );
        }

        for (const font of PdfGenerator.#cachedFonts) {
            this.doc.addFileToVFS(font.file, font.base64);
            this.doc.addFont(font.file, font.family, font.style);
        }
    }

    async loadLocaleData(fileKey) {
        if (!PdfGenerator.#cachedLocaleData[fileKey]) {
            const [pokeNames, moveNames, itemNames, abilityNames, natureNames] = await Promise.all([
                this.#urlFetch(`./Resources/Pokes/poke_name_${fileKey}.json`),
                this.#urlFetch(`./Resources/Moves/move_name_${fileKey}.json`),
                this.#urlFetch(`./Resources/Items/item_name_${fileKey}.json`),
                this.#urlFetch(`./Resources/Abilities/ability_name_${fileKey}.json`),
                this.#urlFetch(`./Resources/Stats/stat_alignment_name_${fileKey}.json`)
            ]);

            PdfGenerator.#cachedLocaleData[fileKey] = {
                "pokemon": pokeNames,
                "move": moveNames,
                "item": itemNames,
                "ability": abilityNames,
                "nature": natureNames
            };
        }
    }

    async parseTeamInput() {

        if (this.userdata.paste === PdfGenerator.#cachedUserInput) {
            return;
        }

        if (this.userdata.paste.toLowerCase().includes("https://pokepast.es/")) {
            const parsedUrl = new URL(this.userdata.paste);
            const idx = parsedUrl.pathname.split("/").filter(Boolean)[0];

            const res = await this.#urlFetch(`https://pokepast.es/${idx}/raw`);
            const ret = Teams.importTeam(res);
            PdfGenerator.#cachedCurrentTeam = ret ? ret.team : null;
        }

        else if (this.userdata.paste.toLowerCase().includes("https://www.vrpastes.com/")) {
            const parsedUrl = new URL(this.userdata.paste);
            const idx = parsedUrl.pathname.split("/").filter(Boolean)[0];

            const res = await this.#urlFetch(`https://vrpaste-backend.vercel.app/api/paste/${idx}?`);
            PdfGenerator.#cachedCurrentTeam = res ? res.teams : null;
        }

        else {
            const res = Teams.importTeam(this.userdata.paste);
            PdfGenerator.#cachedCurrentTeam = res ? res.team : null;
        }

        PdfGenerator.#cachedUserInput = this.userdata.paste;
        PdfGenerator.#cachedTranslatedTeam = null;
    }

    translateTeam() {

        // IMPORTANT: Always call parseTeamInput() funtion before translateTeam() function

        if (PdfGenerator.#cachedTranslatedTeam) {
            return;
        }

        const ret = []
        for (const poke of Object.values(PdfGenerator.#cachedCurrentTeam)){
            const pholder = {}

            pholder["pokemon"] = this.translatorPokes[poke["species"]?.toLowerCase()] ?? "";
            pholder["nature"] = this.translatorStatsAlignments[poke["nature"]?.toLowerCase()] ?? "";
            pholder["ability"] = this.translatorAbilities[poke["ability"]?.toLowerCase()] ?? "";
            pholder["item"] = this.translatorItems[poke["item"]?.toLowerCase()] ?? "";
            pholder["move1"] = this.translatorMoves[poke["moves"][0]?.toLowerCase()] ?? "";
            pholder["move2"] = this.translatorMoves[poke["moves"][1]?.toLowerCase()] ?? "";
            pholder["move3"] = this.translatorMoves[poke["moves"][2]?.toLowerCase()] ?? "";
            pholder["move4"] = this.translatorMoves[poke["moves"][3]?.toLowerCase()] ?? "";
            pholder["evs"] = poke.evs ?? {};
            pholder["ivs"] = poke.ivs ?? {};
            
            ret.push(pholder);

        }

        PdfGenerator.#cachedTranslatedTeam = ret;

    }

    fixFontSize(text, fontName, fontStyle, fontSize, myWidth) {

        let minFontSize = 6;

        this.doc.setFont(fontName, fontStyle);
        this.doc.setFontSize(fontSize);
        
        while (this.doc.getTextWidth(text) > myWidth && fontSize > minFontSize) {
            fontSize -= 0.5;
            this.doc.setFontSize(fontSize);
        }

        return fontSize;
    }

    writeOpenUserData() {
        // write user data
        const userData = [
            {coord: [77.5, 29], text: this.userdata.playername},
            {coord: [77.5, 37], text: this.userdata.trainername},
            {coord: [77.5, 45], text: this.userdata.teamname},
            {coord: [77.5, 53], text: this.userdata.switchname},
        ]

        for (const element of userData){
            this.fixFontSize(element.text, "NotoSans", "regular", 12, 55)
            this.doc.text(element.text, element.coord[0], element.coord[1], { align: "center" });
        }

        // draw checkmark
        const CHECKMARK ={
            "0" : {x1: 154, y1: 26, x2: 160, y2: 32},
            "1" : {x1: 175, y1: 26, x2: 181, y2: 32},
            "2" : {x1: 196, y1: 26, x2: 202, y2: 32}
        }

        const ageDivision = CHECKMARK[this.userdata.age]
        this.doc.setLineWidth(0.8);
        this.doc.line(ageDivision.x1, ageDivision.y1, ageDivision.x2, ageDivision.y2);
        this.doc.line(ageDivision.x1, ageDivision.y1+6, ageDivision.x2, ageDivision.y2-6);
    }

    writeCloseUserData() {
        // write user data
        const userData = [
            {coord: [168.5, 37], text: this.userdata.playerid},
            {coord: [168.5, 45], text: this.userdata.birth},
            {coord: [168.5, 53], text: this.userdata.supportid},
        ]

        for (const element of userData){
            this.fixFontSize(element.text, "NotoSans", "regular", 12, 55)
            this.doc.text(element.text, element.coord[0], element.coord[1], { align: "center" });
        }
    }

    async writePokesNames(lang) {
        const config = PdfGenerator.#LOCALE[lang];

        Object.hasOwn(PdfGenerator.#cachedLocaleData, lang) || await this.loadLocaleData(lang);

        this.doc.setFontSize(12);
        for (const [idx, poke] of Object.entries(PdfGenerator.#cachedTranslatedTeam)) {

            let x = config.tstart + ((this.centerX - PdfGenerator.#rectMarginLeft / 2) * (Number(idx)%2));
            let y = PdfGenerator.#offsetY + PdfGenerator.#rectMarginTop + (PdfGenerator.#headerHeight / 2) + ((PdfGenerator.#rectHeight + PdfGenerator.#rectMarginTop) * Math.floor(Number(idx)/2));

            for (const [jdx, value] of Object.entries(PdfGenerator.#ROWORDER)) {
                let rowY = y + (1 - 0 ** Number(jdx)) * ((PdfGenerator.#rowHeight / 2 + PdfGenerator.#headerHeight / 2) + (PdfGenerator.#rowHeight * (Number(jdx) - 1)));

                this.doc.setFont(config.font, "bold");
                this.doc.text(config[value.title], x, rowY, {baseline: "middle", align: "right"});
                
                this.doc.setFont(config.font, "regular");
                const translator = PdfGenerator.#cachedLocaleData[lang][value.title];
                const input = poke[value.name];
                this.doc.text(translator?.[input] ?? "", x+3, rowY, {baseline: "middle", align: "left"});
            }
        }

        return true;
    }

    drawPokeBoxes() {
        for (let i = 0; i < 6; i++) {
            let x = PdfGenerator.#rectMarginLeft + ((PdfGenerator.#rectWidth + PdfGenerator.#rectMarginLeft) * (i%2));
            let y = PdfGenerator.#rectMarginTop + PdfGenerator.#offsetY + ((PdfGenerator.#rectHeight + PdfGenerator.#rectMarginTop) * Math.floor(i/2));
            this.doc.setLineWidth(0.6);
            this.doc.rect(x, y, PdfGenerator.#rectWidth, PdfGenerator.#rectHeight);

            this.doc.setLineWidth(0.4);
            for (let j = 0; j < 7; j++) {
                this.doc.line(x, y+PdfGenerator.#headerHeight+(PdfGenerator.#rowHeight*j), x+PdfGenerator.#rectWidth, y+PdfGenerator.#headerHeight+(PdfGenerator.#rowHeight*j));
            }
        }
    }

    // Base template for Open and Close lists
    applyBaseTemplate() {

        this.doc.setFont("NotoSans", "bolditalic");
        this.doc.setFontSize(9);
        this.doc.text(PdfGenerator.#textline1, this.centerX, 23.8, { align: "center" });

        this.doc.setFont("NotoSans", "regular");
        this.doc.setFontSize(7);
        this.doc.text(PdfGenerator.#textline2, this.centerX, 290, { align: "center" });

        this.doc.setFont("NotoSans", "bold");
        this.doc.setFontSize(12);
        this.doc.text(PdfGenerator.#textline0, this.centerX, 12, { align: "center" });

        this.doc.setFontSize(10);
        this.doc.text(PdfGenerator.#textline3, 49, 30, { align: "right" });

        this.doc.setFontSize(8);
        this.doc.text(PdfGenerator.#textline4, 49, 38, { align: "right" });

        this.doc.text(PdfGenerator.#textline5, 49, 46, { align: "right" });

        this.doc.text(PdfGenerator.#textline6, 49, 54, { align: "right" });

        this.doc.text(PdfGenerator.#textline7, 140, 30, { align: "right" });
        this.doc.text(PdfGenerator.#textline71, 154, 30, { align: "right" });
        this.doc.text(PdfGenerator.#textline72, 175, 30, { align: "right" });
        this.doc.text(PdfGenerator.#textline73, 196, 30, { align: "right" });

        let startX, startY, elementWidth, elementMargin;
        // User input lines
        this.doc.setLineWidth(0.3);
        startX = 50;
        startY = 31;
        elementWidth = 55;
        elementMargin = 8;
        for (let i = 0; i < 4; i++) {
            this.doc.line(startX, startY+(elementMargin*i), startX+elementWidth, startY+(elementMargin*i));
        }
        
        // Age division checkboxes
        startX = 155;
        startY = 27;
        elementWidth = 4;
        elementMargin = 21;
        for (let i = 0; i < 3; i++) {
            this.doc.rect(startX + (elementMargin*i), startY, elementWidth, elementWidth);
        }

        this.drawPokeBoxes();
    }

    async applyOpenList() {

        // Write and draw base list
        this.applyBaseTemplate();
        
        // Write Pokes
        await this.parseTeamInput();
        this.translateTeam();
        
        await this.writePokesNames(this.userdata.langs[0]);

        // Write title
        this.doc.setFontSize(12);

        const part1 = "2 of 2: ";
        const part2 = "For Opponents";
        this.doc.setFont("NotoSans", "bold");
        const part1Width = this.doc.getTextWidth(part1);
        this.doc.setFont("NotoSans", "bolditalic");
        const part2Width = this.doc.getTextWidth(part2);

        const totalWidth = part1Width + part2Width;
        const part1X = this.centerX - (totalWidth / 2);
        const part2X = this.centerX - (totalWidth / 2) + part1Width;

        this.doc.setFont("NotoSans", "bold");
        this.doc.text(part1, part1X, 18.5);

        this.doc.setFont("NotoSans", "bolditalic");
        this.doc.text(part2, part2X, 18.5);

        // Write user data 
        this.writeOpenUserData();

    }

    async applyCloseList() {

        // Write title
        this.doc.setFontSize(12);

        const part1 = "1 of 2: ";
        const part2 = "For Tournament Staff";
        this.doc.setFont("NotoSans", "bold");
        const part1Width = this.doc.getTextWidth(part1);
        this.doc.setFont("NotoSans", "bolditalic");
        const part2Width = this.doc.getTextWidth(part2);

        const totalWidth = part1Width + part2Width;
        const part1X = this.centerX - (totalWidth / 2);
        const part2X = this.centerX - (totalWidth / 2) + part1Width;

        this.doc.setFont("NotoSans", "bold");
        this.doc.text(part1, part1X, 18.5);

        this.doc.setFont("NotoSans", "bolditalic");
        this.doc.text(part2, part2X, 18.5);

        this.applyBaseTemplate();

        this.doc.text(PdfGenerator.#textline8, 140, 38, { align: "right" });
        this.doc.text(PdfGenerator.#textline9, 140, 46, { align: "right" });
        this.doc.text(PdfGenerator.#textline10, 140, 54, { align: "right" });

        let startX, startY, elementWidth, elementMargin;
        // User input lines
        this.doc.setLineWidth(0.3);
        startX = 141;
        startY = 39;
        elementWidth = 55;
        elementMargin = 8;
        for (let i = 0; i < 3; i++) {
            this.doc.line(startX, startY+(elementMargin*i), startX+elementWidth, startY+(elementMargin*i));
        }

        const config = PdfGenerator.#LOCALE[this.userdata.langs[0]];
        
        await this.parseTeamInput();
        this.translateTeam();

        this.writeOpenUserData();
        this.writeCloseUserData();
        await this.writePokesNames(this.userdata.langs[0]);

        for (const [idx, poke] of Object.entries(PdfGenerator.#cachedTranslatedTeam)){

            if ((Object.keys(poke.evs).length === 0)) {
                this.userdata.error.textContent = '';
                this.userdata.error.textContent  = 'ERROR: PASTE HAS NO EVs';
                return false;
            }

            let stats = this.calculateStats(poke);
            let col = ((this.centerX - PdfGenerator.#rectMarginLeft / 2) * (Number(idx)%2));
            let row = ((PdfGenerator.#rectHeight + PdfGenerator.#rectMarginTop) * Math.floor(Number(idx)/2))

            for (const [jdx, key] of Object.entries(PdfGenerator.#STATORDER)){
                let x = PdfGenerator.#rectMarginLeft + PdfGenerator.#rectWidth + col;
                let y = PdfGenerator.#offsetY + PdfGenerator.#rectMarginTop + PdfGenerator.#headerHeight + PdfGenerator.#rowHeight + row + (PdfGenerator.#rowHeight * Number(jdx));

                this.doc.setFont(config.font, "bold");
                this.doc.setFontSize(6);
                this.doc.text(config[key], x - 14.5, y + 0.5, {baseline: "top", align: "left"});

                this.doc.setFont(config.font, "regular");
                this.doc.setFontSize(10);
                this.doc.text(`${stats[key]}`, x - 7.5 , y+PdfGenerator.#rowHeight - 1, {baseline: "bottom", align: "center"});

            }
        }

        // Draw stat lines
        this.doc.setLineWidth(0.3);
        for (let i = 0; i < 6; i++) {
            let col = ((this.centerX - PdfGenerator.#rectMarginLeft / 2) * (i%2));
            let row = ((PdfGenerator.#rectHeight + PdfGenerator.#rectMarginTop) * Math.floor(i/2))
            let x = PdfGenerator.#rectMarginLeft + PdfGenerator.#rectWidth - 15 + col;
            let y = PdfGenerator.#offsetY + PdfGenerator.#rectMarginTop + PdfGenerator.#headerHeight + PdfGenerator.#rowHeight + row;

            this.doc.line(x, y, x, y+PdfGenerator.#rowHeight*6);
        }

        return true;
    }

    async drawLangBox(idx, lang) {
        const config = PdfGenerator.#LOCALE[lang];

        // Draw box
        let y = PdfGenerator.#mOffsetY + PdfGenerator.#mBoxMarginTop * idx + PdfGenerator.#mBoxHeight * idx;

        this.doc.setLineWidth(0.4);
        this.doc.setDrawColor("black");
        this.doc.rect(PdfGenerator.#mBoxMarginLeft, y, PdfGenerator.#mBoxWidth, PdfGenerator.#mBoxHeight);

        this.fixFontSize(config.lg, config.font, "bold", 12, PdfGenerator.#mBoxMarginLeft - 4);
        this.doc.text(config.lg, 5, y + PdfGenerator.#mRowHeight/2, {baseline: "middle", align: "center"});

        this.doc.setFillColor("#D3D3D3");
        this.doc.setLineWidth(0.3);
        const colors = ["#FFF", "#F0F0F0"];
        for (let i = 0; i < PdfGenerator.#mRowNum; i++) {    
            this.doc.rect(PdfGenerator.#mBoxMarginLeft,  y + (PdfGenerator.#mRowHeight * i), PdfGenerator.#mBoxWidth, PdfGenerator.#mRowHeight, "FD");
            this.doc.setFillColor(colors[i%2]);
        }

        for (let col = 0; col < PdfGenerator.#mColNum; col++) {
            let x = PdfGenerator.#mBoxMarginLeft + PdfGenerator.#mColWidth + (PdfGenerator.#mColWidth * col);
            this.doc.line(x, y, x, y + PdfGenerator.#mBoxHeight );

            for (let row = 0; row < PdfGenerator.#mRowNum; row++) { 
                let textX = x - (PdfGenerator.#mColWidth / 2);
                let textY = y + PdfGenerator.#mRowHeight + (PdfGenerator.#mRowHeight * row) - (PdfGenerator.#mRowHeight/2);
                let text = "";

                if (col === 0){
                    this.doc.setFontSize(9.5);
                    this.doc.setFont(config.font, "bold");
                    const myRow = Math.min(row, 4);
                    text = config[PdfGenerator.#ROWORDER[myRow]["title"]]
                }
                else {
                    const translator = PdfGenerator.#cachedLocaleData[lang][PdfGenerator.#ROWORDER[row]["title"]];
                    const input = PdfGenerator.#cachedTranslatedTeam[col - 1][PdfGenerator.#ROWORDER[row]["name"]];

                    text = translator?.[input] ?? "";
                    this.doc.setFont(config.font, "regular");
                    this.fixFontSize(text, config.font, "regular", 9.5, PdfGenerator.#mColWidth - 2)
                }
                this.doc.text(text, textX, textY, {baseline: "middle", align: "center"})
            }
        }
    }

    //Thanks a lot to Aurélien Soula (Axior) for these brilliant changes
    async applyMultilangList() {

        await Promise.all(
            Object.values(this.userdata.langs).map((lang) =>
                Object.hasOwn(PdfGenerator.#cachedLocaleData, lang) || this.loadLocaleData(lang)
            )
        );
        
        await this.parseTeamInput();
        this.translateTeam();

        for (let [idx, lang] of Object.entries(this.userdata.langs)) {
            if (Number(idx) % PdfGenerator.#mBoxesPerPage === 0 && Number(idx) > 0){
                this.doc.addPage();
            }
            idx = Number(idx) % PdfGenerator.#mBoxesPerPage;
            await this.drawLangBox(Number(idx), lang);
        }

        const totalPages = this.doc.getNumberOfPages();
        this.doc.setFontSize(12);
        for (let i = 1; i <= totalPages; i++) {
            this.doc.setPage(i);
            this.fixFontSize(this.userdata.playername, "NotoSans", "regular", 12, PdfGenerator.#mColWidth*3)
            this.doc.text(this.userdata.playername, this.centerX, PdfGenerator.#mOffsetY/2 + 1,  {baseline: "middle", align: "center"})
            this.fixFontSize(this.userdata.trainername, "NotoSans", "regular", 12, PdfGenerator.#mColWidth*1.2)
            this.doc.text(this.userdata.trainername, PdfGenerator.#mBoxMarginLeft + PdfGenerator.#mColWidth/2, PdfGenerator.#mOffsetY/2 + 1,  {baseline: "middle", align: "center"})
        }
    }
}


//Thanks a lot to @joezhuu for these brilliant changes
const urlParams = new URLSearchParams(window.location.search);
document.getElementById('playerName').value = urlParams.get('player');
document.getElementById('trainerName').value = urlParams.get('trainer');
document.getElementById('teamName').value = urlParams.get('team');
document.getElementById('switchName').value = urlParams.get('switch');
document.getElementById('playerId').value = urlParams.get('id');
document.getElementById('birth').value = urlParams.get('dob');
document.getElementById('supportId').value = urlParams.get('spid');
if (urlParams.get('age')){
    document.getElementById(urlParams.get('age')).checked = true;
}
if (urlParams.get('lang')){
    document.getElementById(urlParams.get('lang')).checked = true;
}


function checkErrors(userdata) {

    userdata.error.textContent = '';

    if (!userdata.sheet) {
        userdata.error.textContent  = 'NO TEAM LIST SELECTED';
        return true;
    }

    if (!userdata.paste) {
        userdata.error.textContent  = 'NO PASTE DETECTED';
        return true;
    }

    if (userdata.langs.length === 0) {
        userdata.error.textContent  = 'NO LANGUAGE SELECTED';
        return true;
    }

    return false;
}



async function main() {

    const userInput = {
        sheet: document.querySelector('input[name="sheet"]:checked')?.value ?? "",
        paste: document.getElementById("paste")?.value ?? "",
        playername: document.getElementById("playerName")?.value.trim() ?? "",
        trainername: document.getElementById("trainerName")?.value.trim() ?? "",
        teamname: document.getElementById("teamName")?.value.trim() ?? "",
        switchname: document.getElementById("switchName")?.value.trim() ?? "",
        playerid: document.getElementById("playerId")?.value.trim() ?? "",
        birth: document.getElementById("birth")?.value.trim() ?? "",
        supportid: document.getElementById("supportId")?.value.trim() ?? "",
        age: document.querySelector('input[name="ageDivision"]:checked')?.value ?? "",
        langs: Array.from(
            document.querySelectorAll('input[name="radioLang"]:checked')
        ).map((el) => el.value),
        error: document.getElementById('error')
    };

    if (checkErrors(userInput)){
        return;
    }

    const userList = new PdfGenerator(userInput);

    userInput.error.textContent = '';
    userInput.error.textContent  = 'GENERATING LIST...';

    await Promise.all([
        userList.loadAllFonts(),
        userList.loadTranslators()
    ]);

    if (userInput.sheet === "open"){
        await userList.applyOpenList();
        userInput.error.textContent  = '';
        userList.doc.save("document.pdf");
    }
    else if (userInput.sheet === "close"){
        if(await userList.applyCloseList()){
            userInput.error.textContent  = '';
            userList.doc.save("document.pdf");
        }
    }
    else if (userInput.sheet=== "reg"){
        await userList.applyMultilangList();
        userInput.error.textContent  = '';
        userList.doc.save("document.pdf");
    }

}


function sheetChange(event) {
    let langInputs = document.getElementsByName('radioLang');
    let spanTags = document.querySelectorAll('#listLang .option');

    if (event.currentTarget.id === "reg"){

        for (const element of langInputs) {
          element.setAttribute("type", "checkbox");
          element.checked = true;
        }

        for (const element of spanTags) {
            element.classList.add("cb");
        }
    } 
    else {
        for (const element of langInputs) {
            element.setAttribute("type", "radio");
        }

        for (const element of spanTags) {
            element.classList.remove("cb");
        }
    }

}


const sheets = document.getElementsByName('sheet');
for (const element of sheets) {
    element.addEventListener('change', sheetChange);
}


const button = document.getElementById('print');
button.addEventListener("click", async () => {
    await main();
});
