//install npm port stemmer package to stem user input
var stemmer = require('porter-stemmer').stemmer
const fs = require('fs')

//get user query
let query = process.argv

//grab word index
let wordIndex = JSON.parse(fs.readFileSync('wordIndex.txt'))

//grab title index
let titleIndex = JSON.parse(fs.readFileSync('indexforIDs.txt'))

//grab freq index
let freqIndex = JSON.parse(fs.readFileSync('freqIndex.txt'))

//loop through different queries
let finalrankings = {}
for (let i = 2; i < query.length; i++) {
  let ranking = getFreqRanking(query[i])

  //loop through ranking and add to final rankings
  for (const key in ranking) {
    if (finalrankings[key]) {
      finalrankings[key] += sq(ranking[key])
    } else {
      finalrankings[key] = ranking[key]
    }
  }
}

//sort final ranking list
let sortedrankings = Object.keys(finalrankings).sort(function(a,b){return finalrankings[b]-finalrankings[a]})
console.log(sortedrankings)

//function returns a ranked list by freq of one word queries
function getFreqRanking (word) {
  //stem words
  word = stemmer(word)
  //grab id list with userInput from word index
  let ids = wordIndex[word]

  //check if word no exist
  if (ids == undefined) {
    return {};
  }

  //create double list to correspond every id with word freq of user input to rank
  let ranking = []

  //loop through ids and get freq
  for (let i = 0; i < ids.length; i++) {
    ///* BEGINING RANKING ALGO *///
    //grab freq of word in each id
    let freqofWord = freqIndex[ids[i]][word]

    //grab total freq of all words to calc ratio
    let totalFreq = 0
    for (const key in freqIndex[ids[i]]) {
      totalFreq += parseInt(freqIndex[ids[i]][key])
    }

    //grab ratio of one word over total
    let ratio = (freqofWord / totalFreq) * 100

    //covert id to title
    let title = titleIndex[ids[i]]

    //add to object
    ranking.push([title, ratio])
  }

  //use quick sort and sort ranking by ratio
  quickSort(ranking, 0, ranking.length - 1)

  //reverse ranking from low to high => high to low
  ranking.reverse()

  //if list is longer than 20...cut it
  if (ranking.length > 20) {
      ranking = ranking.splice(0, 20);
  }

  //covert odd list format to nice obj format
  let rankingObject = {}
  for (let i = 0; i < ranking.length; i++) {
    rankingObject[ranking[i][0]] = ranking[i][1]
  }

  return rankingObject
}

function quickSort (arr, start, end) {
  if (start < end) {
    let pivot = partition(arr, start, end)

    //sort each partition based on pivot pos
    quickSort(arr, start, pivot - 1)
    quickSort(arr, pivot + 1, end)
  }
}

function partition (arr, start, end) {
  //intialize variables of arr indices
  let p = end
  let j = start
  let i = j - 1

  //check between j and p while j < p
  while (j < p) {
    if (arr[j][1] < arr[p][1]) {
      //increment i by 1
      i += 1

      //swap i and j
      let temp = arr[j]
      arr[j] = arr[i]
      arr[i] = temp
    }

    //move j by 1 pos
    j += 1
  }

  //swap between p and i+1
  let temp = arr[p]
  arr[p] = arr[i + 1]
  arr[i + 1] = temp

  //change pivot
  p = i + 1
  return p
}
