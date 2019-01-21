const port = process.env.PORT || 5000
const express = require('express')
const bodyParser = require('body-parser')
const { dialogflow } = require('actions-on-google')

const app = dialogflow()
express().use(bodyParser.json(), app).listen(port)

app.intent('whats on prime time', conv => {
  conv.ask('today on prime time.\non cahnel 12 '+get12PrimeTime("21"))
  get13(conv,"21")
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

function get13(conv,timeH) {
const curl = new (require( 'curl-request' ))();
 
curl.setHeaders([
    'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36'
])
.get('https://reshet.tv/general/tv-guide/')
.then(({statusCode, body, headers}) => {
  var startIndex = body.indexOf("data_query = {")+12
  var data = body.substring(startIndex)
  var endIndex = data.indexOf(";")-1
  data = data.substring(0,endIndex)+"}"
  data = data.substring(data.indexOf("\"0\"")+4)
  data = data.substring(0,data.indexOf("\"1\"")-1)
  console.log(data)
  const dataJson = JSON.parse(data)

  for (var i = 0; i < data.Content.PageGrid[0].broadcastWeek[0].broadcastDayList[0].shows.length; i++){
      if(data.Content.PageGrid[0].broadcastWeek[0].broadcastDayList[0].shows[i].start_time.startsWith(timeH)){
        retValue += data.Content.PageGrid.broadcastWeek[0].broadcastDayList[0].shows[i].title+" will start at "+data.Content.PageGrid.broadcastWeek[0].broadcastDayList[0].shows[i].start_time+".\n"
      }
  }
  if(retValue.length==0){
    conv.ask( "nothing statrt at "+timeH)
  }else{
    conv.ask(retValue)
  }
  
})
.catch((e) => {
    console.log(e);
});

}
