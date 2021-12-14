$(document).ready(function () {
  var API_KEY

  $.get('/apikey', function (key) {
    API_KEY = key;

    //grab all title names from div
    let titles = $("h1").text().split(",");

    //loop through titles and search corresponding videos
    for (let i = 0; i < titles.length; i++) {
        videoSearch(API_KEY, titles[i], 1);
    }
  })
})

function videoSearch (key, search, maxResults) {
  $.get(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=${maxResults}&key=${key}&type=video&q=${search}`,
    function (data) {
      data.items.forEach(item => {
        video = `
            <iframe width="854" height="480" src="http://www.youtube.com/embed/${item.id.videoId}" frameborder="0" allowfullscreen></iframe>
            `

        $('#videos').append(video)
      })
    }
  )
}
