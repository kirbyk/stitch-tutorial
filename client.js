const client = new stitch.StitchClient("charting-zxsyw");
const db = client.service("mongodb", "mongodb-atlas").db("sales-reporting");
const tempData = db.collection("receipts");

function simpleAuth() {
  // const userid = prompt("Enter your User ID:", "");
  // const password = prompt("Enter your Password:", "");
  // client.login(userid, password).then(() => buildGraph());
  client.login().then(buildGraph);
}

let config = {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: "Receipts",
      backgroundColor: 'green',
      borderColor: 'green',
      data: [],
      fill: false,
    }]
  },
  options: {
    responsive: true,
    title:{
      display:true,
      text:'Sales Dashboard'
    },
    tooltips: {
      mode: 'index',
      intersect: false,
    },
    hover: {
      mode: 'nearest',
      intersect: true
    },
    scales: {
      xAxes: [{
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Month'
        }
      }],
      yAxes: [{
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Value'
        }
      }]
    }
  }
};

const dataDuration = 60 * 60 * 1000; // 1 hour of data

function buildGraph() {
  // Use Stitch to pull the latest data and then graph it
  const now = Date.now();
  client
    // .executeNamedPipeline("SalesTimeline", { start: now - dataDuration, end: now })
    .executeNamedPipeline("SalesTimeline")
    .then(docs => {
      console.log(docs);
      const receipts = docs.result[0];

      const timestamps = receipts.map(x => new Date(x.timestamp))
      const totals = receipts.map(x => x.total)

      const ctx = document.getElementById("canvas").getContext("2d");
      const myLine = new Chart(ctx, config);

      config.data.labels = timestamps;
      config.data.datasets[0].data = totals;

      myLine.update();

      // setTimeout(() => {
      //   const lastTimestamp = timestamps.unshift();
      //   refreshGraph(lastTimestamp);
      // }, 1000);
    });
}

function refreshGraph(lastTimestamp) {
  // Find the updated time range
  const now = Date.now();

  // Get any new sales data from Stitch
  client
    // .executeNamedPipeline("SalesTimeline", { start: then, end: now })
    .executeNamedPipeline("SalesTimeline")
    .then(docs => {
    });
}
