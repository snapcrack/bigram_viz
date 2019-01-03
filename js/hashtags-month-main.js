function initHashtagsMonth (_container) {
  var sheetUrl = 'https://docs.google.com/spreadsheets/d/1nPbLjwKqtlkxWCvPiS9ijE23Go9B9a0qkycQfKnF984/edit';
  var container = '#' + _container + '_chart';
  var containerDomNode = document.getElementById(container.slice(1));
  var boundingRect = containerDomNode.getBoundingClientRect();

  var chart = Timeline()
    .container(container)
    .mode('hashtags')
    .svgWidth(boundingRect.width - 30)
    .svgHeight(400)

  // loading data from google sheets
  // loadSheet(sheetUrl)
  d3.csv('./data/hashtag_df.csv')
    .then(response => {
      // var data = {
      //   hashtags: response['hashtag_df'].elements
      // };
      var data = {
        hashtags: response
      };
      containerDomNode.innerHTML = '';
      chart.data(data).render();
    }, (e) => {
      return alert("Error loading data!");
    })
    .catch((e) => {
      console.error(e)
      return alert("Something went wrong!");
    })
    window['chart_' + _container] = chart;
};