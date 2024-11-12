# Wendbare Architectuur

Het woord *agile* betekent *wendbaar*. Het [Agile Manifesto](https://agilemanifesto.org) be­schrijft uitgangspunten om software-ontwikkeling wendbaar te managen (als alternatief voor de waterval-achtige project-mana­gement aanpak geleend van andere disciplines die daarvoor werd gehanteerd).

De kern van alle methoden die bedacht zijn om een agile aanpak te ondersteunen is kort-cyclisch werken:

* Bedenk de kleinste handeling die iets nuttigs oplevert
* Doe dat
* Kijk of het gewerkt heeft
    * Zo ja, bouw erop verder
    * Zo nee, leer ervan en doe iets anders

Bij Evolutionaire Architectuur werken we ook kort-cyclisch met de architectuur (zowel voor het opstellen van de architectuur waar we naar streven als voor het expliciet maken van de huidige architectuur van het systeem).

Cruciaal bij kort-cyclisch werken is feedback. We vragen eind­gebruikers, ontwikkelaars, product owners, infrastructuur spe­cialisten, inkopers, verkopers, en misschien zelfs zo af en toe een directeur "wat zit er volgens jou het minst lekker in het systeem". Deze feedback organiseren we in een architectural-debt backlog. Op basis daarvan bedenken we ideeën om daar iets mee te doen en die organiseren we in een architecture-improvement backlog. Per sprint werken we dan aan een beperkt aantal ideeën van de improvement backlog. Na het imple­menteren van elk idee vragen we opnieuw feedback — er zou iets verbeterd moeten zijn — en werken we beide backlogs bij.

In het boek *Extreme Programming* [Beck2004](#) wordt opgemerkt dat software-ontwikkeling net zoiets is als auto rijden. Er is geen perfecte positie van het stuur. Zelfs niet op een rechte weg. We gebruiken het stuur voor kleine correcties zodat we zo lang we dat willen de uitgestippelde route kunnen volgen en, indien gewenst, een afslag kunnen nemen. Dat is voor architectuur niet anders. Met kleine correcties maken we de huidige architectuur zichtbaar, maken we de uitgangspunten die we zouden willen hanteren helder en maken we het verschil daartussen meetbaar. Daarmee kunnen de ontwikkel-teams het systeem voorbereiden op de toekomst. Niet toekomst-vast, maar stabiel en toekomst-flexibel. Geen beton, maar levend weefsel.