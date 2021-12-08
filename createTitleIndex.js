const fs = require('fs');
const rawMatches = fs.readFileSync("./mxm_779k_matches.txt").toString();
// index that will contain our TID, artist and title
let infoObj = {};

parceMatches(rawMatches);

let data = JSON.stringify(infoObj, null, 2);
fs.writeFileSync("./indexForIDs.txt", data);

//will parce the file that contains TID, artist, title
function parceMatches(tempFileMatch) {
    let matchFile = tempFileMatch.split("\n");
    for (let track = 0; track < matchFile.length; track++) {
        //each track is now separated into (0) TID, (1) Artist, (2) Title
        matchFile[track] = matchFile[track].split("<SEP>");
        matchFile[track] = [matchFile[track][0], matchFile[track][1], matchFile[track][2]];
    }
    // matchFile = matchFile.join("\n");
    // fs.writeFileSync("./parsed.txt", matchFile);
    indexTime_ID(matchFile);
}

function indexTime_ID(idFile) {
    for (let track = 0; track < idFile.length; track++) {
    infoObj[idFile[track][0]] = idFile[track][2] + " by " + idFile[track][1]
    }
}
