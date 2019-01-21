const port = process.env.PORT || 5000
const express = require('express')
const bodyParser = require('body-parser')
const { dialogflow } = require('actions-on-google')

const app = dialogflow()
express().use(bodyParser.json(), app).listen(port)

app.intent('whats on prime time', conv => {
  conv.ask('today on prime time.\non cahnel 12 '+get12PrimeTime("21"))
  get13()
})

app.intent('whats at', (conv, {time}) => {
  if(time.length==1){
    time = "0"+time
  }
  conv.ask("today at "+time+".\non cahnel 12 "+get12PrimeTime(time))
})

app.intent('Default Welcome Intent', conv => {
  conv.ask('hi this is israel tv guide')
})
app.fallback((conv) => {
  conv.ask('kapara, what do you want?');
  conv.ask('command that i know are');
  conv.ask('whats on prime time');
  conv.ask('whats at ');
})


function get12PrimeTime(timeH) {
  var request = require('sync-request');
  var result = request('GET','https://www.mako.co.il/AjaxPage',{
      qs:{jspName:'EPGResponse.jsp'}
  });
  const data = JSON.parse(result.body.toString('utf-8'));
  var retValue = ""
  for (var i = 0; i < data.programs.length; i++){
    if(data.programs[i].day=== "הערב"){
      if(data.programs[i].DisplayStartTime.startsWith(timeH)){
        retValue += data.programs[i].EnglishName+" will start at "+data.programs[i].DisplayStartTime+".\n"
      }
    }
  }
  if(retValue.length==0){
    return "nothing statrt at "+timeH
  }else{
    return retValue
  }
}

function get13(timeH) {

  const curl = new (require( 'curl-request' ))();
 
curl.setHeaders([
    'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36'
])
.get('http://reshet.tv/general/tv-guide/')
.then(({statusCode, body, headers}) => {
    console.log(statusCode, body, headers)
})
.catch((e) => {
    console.log(e);
});
//   var request = require('sync-request');
//   var result = request('GET','http://reshet.tv/general/tv-guide/',{
//   headers: {
//     "user-agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:55.0) Gecko/20100101 Firefox/55.0",
//     "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
//     "accept-language": "en-US,en;q=0.5",
//     "accept-encoding": "gzip, deflate",
//     "connection": "keep-alive",
//     "upgrade-insecure-requests": "1"
//   }});
//   var data = result.body.toString('utf-8');
//   console.log(data)
//   var startIndex = data.indexOf("data_query = {")+12
//   data = data.substring(startIndex)
//   var endIndex = data.indexOf(";")+12
//   data = data.substring(0,endIndex)
//   console.log(data)
//   const dataJson = JSON.parse(data)
}
