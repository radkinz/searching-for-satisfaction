const fs = require('fs');

//grab file
let file = fs.readFileSync("mxm_dataset_test.txt").toString().split("\n");

//get possible words
let possiblewords = file[0].split(",");

//get all song data
let songs = file.splice(1, file.length-1)

//create object that corresponds every word with possible ids
let words = {};

//loop through all songs and correspond each word to a id
for (let i = 0; i < songs.length; i++) {
    //grab the words by excluding the ids from each line
    let songword = songs[i].split(",").splice(2, songs[i].split(",").length-1);

    //grab id
    let id = songs[i].split(",")[0];

    //loop through all words
    for (let j = 0; j < songword.length; j++) {
        //seperate word
        let word = possiblewords[parseInt(songword[j].split(":")[0])];

        //check if word is in object already..if not in object then add to object
        if (words[word]) {
            words[word].push(id);
        } else {
            words[word] = [id];
        }
    }
}

//write to word index file in json form
fs.writeFileSync("./wordIndex.txt", JSON.stringify(words));

//if you want to check what this index looks like in object form then console.log(JSON.parse(fs.readFileSync("wordIndex.txt")))