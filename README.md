# PokemonTeamListCreator
Creates Team List for Pokémon tournaments

Update November 2026:
- Reworked from scratch the whole site.
- Bandwidth performance tweaks. (Very first load may be slow).
- Up to date Regulation M-C (pending update 2nd of December Regulation M-D)
- Modified wording: "Stat Alignment" in all the languages of the game.
- Added languages headings translations to the lists. The headings "pokémon, item, stat alignment, ability, move" are now in the language selected.
- Added LATAM language
- Added "Stat Alignment" to Multilanguage list.
- Multilanguage list now crops to selected languages. It will fit the tables from top to bottom of the page. Min 1 table and up to 10 tables (each PDF page fits 6 tables, above that number of languages it creates a new page)
- Added Pokepast and VRpaste to input. Now you can paste the link or the whole text of a team.
- Pending:
  - Sprites team list
  - Ask for translations of lists text for each language of the game. (I will appreciate if you can help with that.)
  - Add Regulation M-D
  - More bandwidth tweaks


Update March 2024
- Added multi language list. Thanks a lot to Aurélien Soula (Axior)

Update December 2023:
- Added Pokémon from The Indigo Disk
- Added the ability to pass URL parameters ([Thanks to Joe Zhu](https://twitter.com/joezhuu)):
  - player=text
  - trainer=text
  - team=text
  - switch=text
  - id=text
  - dob=text (recommended use -)
  - age=junior, senior or master
  - lang=chs, cht, en, es, fre, ger, ita, jpn, jpnkanji or kor
  - spid=text support ID

Update July 2023:
- Added Pokémon for Regulation D
- Improved file size (about x50 less disk space)
  
Pending: Special characters not allowed (for example ★)

Libraries used, (thanks for your work):

https://github.com/smogon/pokemon-showdown/blob/master/sim/TEAMS.md

https://github.com/projectpokemon/champout

https://github.com/parallax/jsPDF
