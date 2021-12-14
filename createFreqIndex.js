const fs = require('fs')

//grab file
let file = fs
  .readFileSync('mxm_dataset_test.txt')
  .toString()
  .split('\n')

//get possible words
let possiblewords = file[0].split(',')

//get all song data
let songs = file

//create object that corresponds every id with word freq
let index = {}

//loop through every id and add to index
for (let i = 1; i < songs.length; i++) {
  //grab the words by excluding the ids from each line
  let songdata = songs[i].split(',')

  //grab id
  let id = songs[i].split(',')[0]

  //add empty object which will fill with words/freq in index for id pos
  index[id] = {}

  //loop through words and and to index id obj
  for (let j = 2; j < songdata.length; j++) {
    let word = possiblewords[parseInt(songdata[j].split(":")[0])-1];
    let freq = songdata[j].split(':')[1];
    //console.log(word, id, songdata[j], freq)

    //add word and freq inside object
    index[id][word] = freq
  }
}

//write to freq index file in json form
fs.writeFileSync('./freqIndex.txt', JSON.stringify(index, null, 2))
