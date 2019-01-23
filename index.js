const port = process.env.PORT || 5000
const express = require('express')
const bodyParser = require('body-parser')
const { dialogflow } = require('actions-on-google')

var chanel13Cache = null
var chanel13CacheDate = new Date()

const app = dialogflow()
express().use(bodyParser.json(), app).listen(port)

app.intent('whats on prime time', conv => {
  conv.ask('<speak><p><s>today on prime time.<\s><s>on cahnel 12 '+get12PrimeTime("21") +'</s><s>and on chanel 13 '+get13("21")+'<\s><\p><\speak>')
})

app.intent('whats at', (conv, {time}) => {
  if(time.length==1){
    time = "0"+time
  }
  conv.ask('<speak><p><s>today at "+time+".<\s><s>on cahnel 12 '+get12PrimeTime(time) +'<\s><s>and on chanel 13 '+get13(time)+'<\s><\p><\speak>')
})

app.intent('Default Welcome Intent', conv => {
  conv.ask('hi this is israel tv guide')
})
app.fallback((conv) => {
  var today = new Date();
  var diffDays = Math.floor((today - chanel13CacheDate) / 86400000); // days
  if(diffDays>1 || chanel13Cache == null){
    refresh13cache()
  }

  conv.ask('<speak><p><s>kapara, what do you want?<\s><s>command that i know are:<\s><s>whats on prime time.<\s><s>whats at number.<\s><\p><\speak>');
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
        retValue += data.programs[i].EnglishName+' will start at '+data.programs[i].DisplayStartTime+'.<\s><s>'
      }
    }
  }
  if(retValue.length==0){
    return "nothing statrt at "+timeH+"<\s><s>"
  }else{
    return retValue
  }
}

function refresh13cache(){
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
  
  chanel13Cache = JSON.parse(data)
  chanel13CacheDate = new Date();
  
})
.catch((e) => {
    console.log(e);
});
}
function get13(timeH) {

  var today = new Date();
  var diffDays = Math.floor((today - chanel13CacheDate) / 86400000); // days
  if(diffDays>1 || chanel13Cache == null){
    refresh13cache()
  }
  var dayNow = today.getUTCDate();
  var retValue = ""
  if(chanel13Cache != null){
    for (var i = 0; i < chanel13Cache.broadcastDayList.length; i++){
      if(chanel13Cache.broadcastDayList[i].shortDate.startsWith(dayNow)){
        for (var x = 0; x < chanel13Cache.broadcastDayList[i].shows.length; x++){
          if(chanel13Cache.broadcastDayList[i].shows[x].start_time.startsWith(timeH)){
            retValue += chanel13Cache.broadcastDayList[i].shows[x].title+" will start at "+chanel13Cache.broadcastDayList[i].shows[x].start_time+".<\s><s>"
          }
        }
      }
    }
  }
  console.log(retValue)
  if(retValue.length==0){
    if(chanel13Cache == null){
      return "we are geting data"
    }
    return "nothing statrt at "+timeH+'<\s><s>'
  }else{
    return retValue
  }

}
