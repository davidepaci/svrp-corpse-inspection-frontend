// Image Map Responsiveness & Tooltipster
$(document).ready(function() {
    $('map[name=map] area').on('click',function(e){
        e.stopPropagation();
        return false;
    });

    $('map').imageMapResize();

    // Remove function when in production
    getCorpseInfoSimulated();
});

/* ============= CLIENT UI ============= */
// Hit areas dictionary
const areaDictionary = {
    'head': 'Testa',
    'torso': 'Torso',
    'left-arm': 'Braccio sinistro',
    'right-arm': 'Braccio destro',
    'left-leg': 'Gamba sinistra',
    'right-leg': 'Gamba destra',
};

// Tooltips/Elaborated hits object (we keep all info in this to get them into the tooltips after the cycle)
var elaboratedHits = {};

// Function: replace zone string with a proper Italian one
function italianizeZone(zone) {
    return areaDictionary[zone];
}

// Function: show newly clicked zone hits
function showHit(zone) {
    if (elaboratedHits[zone] === undefined) document.getElementById('hit').innerHTML = 'Nessuna ferita';
    else document.getElementById('hit').innerHTML = elaboratedHits[zone];
    document.getElementsByClassName('corpse-info')[0].style.display = 'block';
}

// SIMULATED FUNCTION OF getCorpseInfo(corpse)
function getCorpseInfoSimulated() {
    var corpse = {name: 'John Marston', hitList: [{zone: 'head', weapon: 'Glock-18'},{zone: 'head', weapon: 'Glock-18'},{zone: 'torso', weapon: 'AK47'},{zone: 'head', weapon: 'Colt M1873'},{zone: 'right-arm', weapon: 'Desert Eagle Mark XIX'}]};

    // Set corpse's name
    document.getElementById('corpseName').innerHTML = corpse.name;

    // Checked list of hits
    var checkedIndexes = [];

    // Scroll through every hit,  and put them in the right lists
    for (i = 0; i < corpse.hitList.length; i++) {
        if (!checkedIndexes.includes(i)) {
            let hits = 1;

            // Organize them if multiple hits of the same zone and weapon
            for (j = i+1; j < corpse.hitList.length; j++) {
                if (corpse.hitList[j].zone == corpse.hitList[i].zone && corpse.hitList[j].weapon == corpse.hitList[i].weapon) {
                    // Increase number of hits (same source same weapon)
                    hits++;
                    // Add index in a 'checked' list (so they don't appear again)
                    checkedIndexes.push(j);
                }
            }

            // Put the hits in the list (append if hit already exists)
            let newContent = '<b>' + italianizeZone(corpse.hitList[i].zone) + ' - ' + hits + ' </b> ' + (hits > 1 ? 'colpi' : 'colpo') + ' di <b>' + corpse.hitList[i].weapon + '</b>';
            if (elaboratedHits[corpse.hitList[i].zone]) {
                elaboratedHits[corpse.hitList[i].zone] = elaboratedHits[corpse.hitList[i].zone] + '<br/>' + newContent;
            } else elaboratedHits[corpse.hitList[i].zone] = newContent;
        }
    }

    /*// Add all hits from elaboratedHits to the tooltips
    for(const [index, hit] of Object.entries(elaboratedHits) ){
        if ('#' + `${index}` == '#right-arm' || '#' + `${index}` == '#right-leg') {
            $('#' + `${index}`).tooltipster({
                content: $(`${hit}`),
                position: 'left'
            });
        } else if ('#' + `${index}` == '#left-arm' || '#' + `${index}` == '#left-leg') {
            $('#' + `${index}`).tooltipster({
                content: $(`${hit}`),
                position: 'right'
            });
        } else {
            $('#' + `${index}`).tooltipster({
                content: $(`${hit}`)
            });
        }
      }*/
}

/* ============= CALLS ============= */
/* [!] Functions to manage server calls (read 'Server -> Frontend calls') */
// Function: initialize the corpse with all the info received
function getCorpseInfo(corpse) {
    var corpse = JSON.parse(corpse);

    // Dead character's name
    document.getElementById('corpseName').innerHTML = corpse.name;
    
    // Set corpse's name
    document.getElementById('corpseName').innerHTML = corpse.name;

    // Checked list of hits
    var checkedIndexes = [];

    // Scroll through every hit,  and put them in the right lists
    for (i = 0; i < corpse.hitList.length; i++) {
        if (!checkedIndexes.includes(i)) {
            let hits = 1;

            // Organize them if multiple hits of the same zone and weapon
            for (j = i+1; j < corpse.hitList.length; j++) {
                if (corpse.hitList[j].zone == corpse.hitList[i].zone && corpse.hitList[j].weapon == corpse.hitList[i].weapon) {
                    // Increase number of hits (same source same weapon)
                    hits++;
                    // Add index in a 'checked' list (so they don't appear again)
                    checkedIndexes.push(j);
                }
            }

            // Put the hits in the list (append if hit already exists)
            let newContent = '<b>' + italianizeZone(corpse.hitList[i].zone) + ' - ' + hits + ' </b> ' + (hits > 1 ? 'colpi' : 'colpo') + ' di <b>' + corpse.hitList[i].weapon + '</b>';
            if (elaboratedHits[corpse.hitList[i].zone]) {
                elaboratedHits[corpse.hitList[i].zone] = elaboratedHits[corpse.hitList[i].zone] + '<br/>' + newContent;
            } else elaboratedHits[corpse.hitList[i].zone] = newContent;
        }
    }
}

/* [!] Frontend -> Server functions */
// Function: close inspection
function exitInspection() {
    mp.events.call('destroyBrowser');
}

/* [!] Server -> Frontend calls */
// Call: get all the needed info about the corpse
mp.events.add('getCorpseInfo', (json) => {
    getCorpseInfo(json);
});