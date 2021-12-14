//random possible options
let options = ['Hungry', 'Funny', 'H*rny', 'Trendy', 'Stellar', 'Emo', 'Big', 'Good', 'Bad', 'Tired', 'Sleepy']

$('#luckybutton').mouseover(function () {
    console.log($('#input_text').val())
  if ($('#input_text').val() == "") {
    //add random val
    let randomval = options[random(options.length)]
    $('#luckybutton').val("I'm Feeling " + randomval)
  }
})

$('#luckybutton').mouseleave(function () {
  $('#luckybutton').val("I'm Feeling Lucky")
})

function random (max) {
  return Math.floor(max * Math.random())
}
