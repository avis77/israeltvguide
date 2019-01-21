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
  var request = require('sync-request');
  var result = request('GET','https://www.mako.co.il/AjaxPage',{
      qs:{jspName:'EPGResponse.jsp'}
  });
  const data = JSON.parse(result.body.toString('utf-8'));
console.log(`got ${data.programs[1].ProgramName}`)
  res.send('Hello World!')
  
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
