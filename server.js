//install npm port stemmer package to stem user input
var stemmer = require('porter-stemmer').stemmer
const fs = require('fs')
const express = require('express')
const app = express()
const http = require('http').Server(app)
const bodyParser = require('body-parser')
const config = require('dotenv').config()

const YOUTUBE_API_KEY = process.env.API_KEY

app.use(express.static('public'))

//setup app
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static('public'))

var engines = require('consolidate')
app.engine('html', engines.hogan)
app.set('views', __dirname + '/views')

app.get('/', (req, res) => {
  res.render('index.html', {})
})

app.post('/searchWord', (req, res) => {
  //turn list into obj to render
  let titles = grabsongs(req.body.input_text)
  let songs = []
  for (let i = 0; i < titles.length; i++) {
    songs.push({ Title: titles[i] })
  }

  res.render('index.html', { Songs: songs })
})

app.post('/displaySong', (req, res) => {
  res.render('song.html', { Songs: { Title: req.body.submit } })
})

//obj to match phrases
let phrases = {
  "Hungry" : "banana",
  "Stellar" : "happy",
  "Funny" : "clown",
  "Horny" : "sex",
  "Trendy" : "new"
}

app.post('/feelingLucky', (req, res) => {
  //check if button is lucky or not
  if (req.body.submit == "I'm Feeling Lucky") {
    //turn list into obj to render
    let titles = grabsongs(req.body.input_text)

    res.render('song.html', { Songs: { Title: titles[0] } })
  } else {
    //grab key word
    let query = req.body.submit.split(" ")[2];
    let titles = grabsongs(phrases[query]);
    if (titles.length > 3) {
      res.render('song.html', { Songs: { Title: titles[random(3)] } })
    } else {
      res.render('song.html', { Songs: { Title: titles[0] } })
    }
  }
})

app.get('/apikey', (req, res) => {
  res.send(YOUTUBE_API_KEY)
  res.end()
})

//grab word index
let wordIndex = JSON.parse(fs.readFileSync('wordIndex.txt'))

//grab title index
let titleIndex = JSON.parse(fs.readFileSync('indexforIDs.txt'))

//grab freq index
let freqIndex = JSON.parse(fs.readFileSync('freqIndex.txt'))

function grabsongs (words) {
  //loop through different queries
  let finalrankings = {};
  words = words.split(' ');

  for (let i = 0; i < words.length; i++) {
    //clean word
    let word = words[i].toLowerCase();
    //strip punctuation
    var regex = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g;
    word = word.replace(regex, '');

    let ranking = getFreqRanking(word)

    //loop through ranking and add to final rankings
    for (const key in ranking) {
      if (finalrankings[key]) {
        finalrankings[key] += ranking[key]
      } else {
        finalrankings[key] = ranking[key]
      }
    }
  }

  //sort final ranking list
  let sortedrankings = Object.keys(finalrankings).sort(function (a, b) {
    return finalrankings[b] - finalrankings[a]
  })

  //if list longer than 30....shorten it
  if (sortedrankings.length > 30) {
    sortedrankings = sortedrankings.splice(0, 30)
  }

  //check if empty
  if (sortedrankings.length == 0) {
    return ['No results found.']
  } else {
    return sortedrankings
  }
}

//function returns a ranked list by freq of one word queries
function getFreqRanking (word) {
  //stem words
  word = stemmer(word)

  //grab id list with userInput from word index
  let ids = wordIndex[word]

  //check if word no exist
  if (ids == undefined) {
    return {}
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

  //if list is longer than 200...cut it
  if (ranking.length > 200) {
    ranking = ranking.splice(0, 200)
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

function random(max) {
  return Math.floor(Math.random() * max)
}

app.listen(3000, () => {
  console.log('listening on *:3000')
})
