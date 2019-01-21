const port = process.env.PORT || 5000
const express = require('express')
const bodyParser = require('body-parser')
const { dialogflow } = require('actions-on-google')

const app = dialogflow()
express().use(bodyParser.json(), app).listen(port)

app.intent('get', conv => {
  conv.ask(`today on prime time.\n`)
  conv.ask('on cahnel 12 '+get12PrimeTime("21"))
})

app.intent('get at', conv => {
  conv.ask(`today on prime time.\n`)
  conv.ask('on cahnel 12 '+get12PrimeTime("21"))
})

app.intent('Default Welcome Intent', conv => {
  conv.ask(`hi this is israel tv guide`)
})
app.intent('Default Fallback Intent', conv => {
  conv.ask(`like a cow, what do you want?`);
})


function get12PrimeTime(timeH) {
  var request = require('sync-request');
  var result = request('GET','https://www.mako.co.il/AjaxPage',{
      qs:{jspName:'EPGResponse.jsp'}
  });
  const data = JSON.parse(result.body.toString('utf-8'));
  console.log(`got ${data.programs[1].ProgramName}`)
  for (var i = 0; i < data.programs.length; i++){
    if(data.programs[i].DisplayStartTime.startsWith(timeH)){
      return data.programs[i].ProgramName
    }
  }
  
}

