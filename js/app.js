(function () {
    var container = document.getElementById('tree-chart');
    var forceChart = document.getElementById('chart');

    var height = 290;

    // load as of data from text file
    d3.text('./data/as_of_date.txt')
    .then(res => {
      var momentDate = moment(res).format('MMMM Do, YYYY');
      var momentMonth = moment(res).format('MMMM');

      d3.select('#title')
        .text(`Trump's Tweets as of ${momentDate}`);

      init(momentMonth);
    })

    function init (month) {
      var treeData = {
        name: 'root',
        id: 0,
        children: [
          {
            name: 'Phrases',
            id: 1,
            children: [
              { 
                name: 'All',
                container: 'phrases_all',
                initFunction: initPhrasesAll 
              },
              { 
                name: month,
                id: 3,
                enlargeScreen: true,
                children: [
                  {
                    name: 'Unsort',
                    isForce: true,
                    container: 'phrases_month',
                    mode: 'initial'
                  },
                  {
                    name: 'Sort by count',
                    container: 'phrases_month',
                    isForce: true,
                    mode: 'desc'
                  },
                  {
                    name: 'Sort by sentiment',
                    container: 'phrases_month',
                    isForce: true,
                    mode: 'color'
                  }
                ]
              }
            ]
          },
          {
            name: 'Hashtags',
            id: 7,
            children: [
              { 
                name: 'All',
                container: 'hashtags_all',
                initFunction: initHashtagsAll
              },
              { 
                name: month,
                container: 'hashtags_month',
                initFunction: initHashtagsMonth,
                isTimeline: true
              }
            ]
          },
          {
            name: 'Mentions',
            id: 10,
            children: [
              { 
                name: 'All' ,
                container: 'mentions_all',
                initFunction: initMentionsAll
              },
              { 
                name: month,
                container: 'mentions_month',
                initFunction: initMentionsMonth,
                isTimeline: true
              }
            ]
          }
        ]
      };
  
      Tree()
          .data(treeData)
          .container('#tree-chart')
          .onChartSelect(node => {
            // hide all charts
            d3.selectAll('.js-chart-row').classed('d-none', true);
            // show the current chart only
            var _container = document.getElementById(node.data.container);
            _container.classList.remove('d-none');
            // getting the chart instance
            var chart = window['chart_' + node.data.container];
  
            // if chart exists, then we should just show it
            if (chart) {
              if (node.data.isForce) {
                chart.orderNodes(node.data.mode);
              } else if (node.data.isTimeline) {
                chart.animate(true).render();
              }
            } 
            // if chart does not exist, we need to initialize it
            else {
              if (node.data.isForce) {
                initBigram(node.data.mode, node.data.container);
              } else {
                node.data.initFunction(node.data.container);
              }
            }
          })
          .svgWidth(container.getBoundingClientRect().width - 41)
          .svgHeight(height)
          .render();
    }
    
})();