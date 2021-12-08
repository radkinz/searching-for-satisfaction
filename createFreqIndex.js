const fs = require('fs');

//grab file
let file = fs.readFileSync("mxm_dataset_test.txt").toString().split("\n");

//get possible words
let possiblewords = file[0].split(",");

//get all song data
let songs = file.splice(1, file.length-1)

//create object that corresponds every id with word freq
let index = {};

//loop through every id and add to index
for (let i = 0; i < songs.length; i++) {
    let songdata = songs[i].split(",");

    let id = songdata[0];

    //add empty object which will fill with words/freq in index for id pos
    index[id] = {};

    //loop through words and and to index id obj
    for (let j = 2; j < songdata.length; j++) {
        let word = possiblewords[parseInt(songdata[j].split(":")[0])];
        let freq = songdata[j].split(":")[1];

        //add word and freq inside object
        index[id][word] = freq;
    }
}

//write to freq index file in json form
fs.writeFileSync("./freqIndex.txt", JSON.stringify(index, null, 2));