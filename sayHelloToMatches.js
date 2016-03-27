import tinder from 'tinderjs';
import Promise from 'bluebird';
import _ from 'lodash';
import tinderauth from 'tinderauth';
import emoji from 'node-emoji'

process.on('unhandledRejection', console.log)

const client = Promise.promisifyAll(new tinder.TinderClient());

const email = process.env.FACEBOOK_EMAIL
const password = process.env.FACEBOOK_PASSWORD
const myTinderId = process.env.TINDER_ID

let fbid = process.env.FACEBOOK_ID;
let fbtoken = process.env.FACEBOOK_TOKEN;

// used emojis:
// emoji.get('relaxed') <-- best
// emoji.get('blush') 

async function sayHelloToFirstMatch(){
  // let response = await client.getHistoryAsync();

  let response = await client.sendMessageAsync(id, `Hey, how are you! ${emoji.get('blush')}`);

  console.log(response);
}

async function getHistoryData(){

  let data = await client.getHistoryAsync();

  console.log(  JSON.stringify(data, null, 2)  )
}



async function sayHelloToMatches(){

  let data = await client.getHistoryAsync();

  let { matches } = data

  _.forEach(matches, function(girl, number){
    let timeout = number * 5000

    setTimeout(async function(){

      // send message here
      // 
      
    }, timeout)
  })
}


async function main(){

  // if(!fbid || !fbtoken){
  //   const { fbtoken, fbid } = await tinderauth(email, password);
  //   console.log(fbtoken, fbid);
  // }

  client.authorize(fbtoken, fbid, async function(){
    getHistoryData()
  });

}

main()