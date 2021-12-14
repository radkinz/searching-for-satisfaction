const fs = require('fs');

//grab file
let file = fs.readFileSync("mxm_dataset_test.txt").toString().split("\n");

//get possible words
let possiblewords = file[0].split(",");

//get all song data
let songs = file;

//create object that corresponds every word with possible ids
let words = {};

//loop through all songs and correspond each word to a id
for (let i = 1; i < songs.length; i++) {
    //grab the words by excluding the ids from each line
    let songword = songs[i].split(",");

    //grab id
    let id = songs[i].split(",")[0];

    //loop through all words
    for (let j = 2; j < songword.length; j++) {
        //seperate word
        let word = possiblewords[parseInt(songword[j].split(":")[0])-1];
        //cconsole.log(word, id, songword[j])

        //check if word is in object already..if not in object then add to object
        if (words[word]) {
            words[word].push(id);
        } else {
            words[word] = [id];
        }
    }
}

//write to word index file in json form
fs.writeFileSync("./wordIndex.txt", JSON.stringify(words, null, 2));

//if you want to check what this index looks like in object form then console.log(JSON.parse(fs.readFileSync("wordIndex.txt")))