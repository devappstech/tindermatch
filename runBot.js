import tinder from 'tinderjs';
import Promise from 'bluebird';
import _ from 'lodash';

const client = Promise.promisifyAll(new tinder.TinderClient());

const fbid = process.env.FACEBOOK_ID;
const fbtoken = process.env.FACEBOOK_TOKEN;

process.on('unhandledRejection', console.log)

function getYearsOld(girlsBirthday){
  let todaysDate = new Date();
  let girlsDate = new Date(girlsBirthday)
  var timeDiff = Math.abs(todaysDate.getTime() - girlsDate.getTime());
  var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
  var diffYears = Math.floor(diffDays/365)
  return diffYears
}

let overallCounter = 0;

async function likeTenTinderGirls(){

  let data = await client.getRecommendationsAsync(20);

  if(data.message == 'recs timeout'){
    setTimeout(async function(){
      console.log('recs timeout error, retrying in a minute')
      await likeTenTinderGirls();
    }, 1000 * 60 * 2)
  }

  let { results } = data

  let countUntil = data.results.length;

  let counter = 0;

  _.forEach(results, function(value, number){
    let timeout = number * 2000

    setTimeout(async function(){
      let age = getYearsOld(value.birth_date)

      overallCounter++

      console.log(`We just liked ${value.name}, who is ${age} years old: ${value._id} ${overallCounter}`)
      
      let likeResponse = await client.likeAsync(value._id)

      counter++

      if(counter == countUntil){
        setTimeout(async function(){
          await likeTenTinderGirls()
        }, 15000)
      }
    }, timeout)
  })
}

client.authorize(fbtoken, fbid, async function(){
  likeTenTinderGirls()
});