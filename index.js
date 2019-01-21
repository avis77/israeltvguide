const express = require('express')
const app = express()
const port = process.env.PORT || 5000

app.get('/', (req, res) => {
  console.log('get')
  console.log(req.query)
  console.log(req.params)
  var request = require('sync-request');
  var result = request('GET','https://www.mako.co.il/AjaxPage',{
      qs:{jspName:'EPGResponse.jsp'}
  });
  const data = JSON.parse(result.body.toString('utf-8'));
console.log(`got ${data.programs[1].ProgramName}`)
  res.send('Hello World!')
  
})

app.post('/', (req, res) => {
  console.log('post')
  console.log(req.query)
  console.log(req.params)
  
  // Import the appropriate class
  const { WebhookClient } = require('dialogflow-fulfillment');

  //Create an instance
  const agent = new WebhookClient({request: req, response: res});

  function welcome(agent) {
    agent.add(`hi this is israel tv guide`);
  }
 
  function fallback(agent) {
    agent.add(`like a cow, what do you want?`);
  }

  function yourFunctionHandler(agent) {
    var request = require('sync-request');
    var result = request('GET','https://www.mako.co.il/AjaxPage',{
        qs:{jspName:'EPGResponse.jsp'}
    });
    const data = JSON.parse(result.body.toString('utf-8'));
    console.log(`got ${data.programs[1].ProgramName}`)
    agent.add('${data.programs[1].ProgramName}')
  }
  
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('get', yourFunctionHandler);

  agent.handleRequest(intentMap);
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
