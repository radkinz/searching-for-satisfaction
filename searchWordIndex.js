//install npm port stemmer package to stem user input
var stemmer = require('porter-stemmer').stemmer;
const fs = require('fs');

//get user query
let query = process.argv;

//grab word index
let wordIndex = JSON.parse(fs.readFileSync("wordIndex.txt"));

//stem query of user input
let userinput = stemmer(query[2]);
console.log(userinput)

//search userinput in wordIndex
console.log(wordIndex[userinput]);
