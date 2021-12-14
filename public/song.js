$(document).ready(function () {
  var API_KEY

  $.get('/apikey', function (key) {
    API_KEY = key;

    //grab all title names from div
    let titles = $("h1").text().split(",");

    console.log(titles)

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
            <iframe width="500" height="500" src="http://www.youtube.com/embed/${item.id.videoId}?autoplay=1&mute=1" frameborder="0" allowfullscreen></iframe>
            `

        $('#videos').append(video);
        console.log(item)

        $("html").css("background-image", "url(" + item.snippet.thumbnails.high.url + ")");
      })
    }
  )
}
