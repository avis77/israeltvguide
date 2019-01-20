const express = require('express')
const app = express()
const port = process.env.PORT || 5000

app.get('/', (req, res) => {
  console.log(`got ${req} ${req}`)
  var request = require('sync-request');
  var res = request('GET','https://www.mako.co.il/AjaxPage',{
      qs:{jspName:'EPGResponse.jsp'}
  });
  const data = JSON.parse(res.body.toString('utf-8'));
console.log(`got ${data}`)
  res.send('Hello World!')
  
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
