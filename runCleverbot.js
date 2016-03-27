import tinder from 'tinderjs';
import Promise from 'bluebird';
import _ from 'lodash';
import tinderauth from 'tinderauth';
import emoji from 'node-emoji'
import Cleverbot from 'cleverbot-node'

/*    Initialization      */

const cleverbot = new Cleverbot;

const client = Promise.promisifyAll(new tinder.TinderClient());

let fbid = process.env.FACEBOOK_ID;
let fbtoken = process.env.FACEBOOK_TOKEN;
const myTinderId = process.env.TINDER_ID

console.log(fbid, fbtoken, myTinderId)

if(!fbid || !fbtoken || !myTinderId){
  console.log('undefined env vars')
  process.exit()
} 

// const email = process.env.FACEBOOK_EMAIL
// const password = process.env.FACEBOOK_PASSWORD


function cleverbotWriteAsync(message){
    return new Promise(function(resolve, reject){
        cleverbot.write(message, resolve, reject);
    });
}

function cleverbotPrepareAsync(){
    return new Promise(function(resolve, reject){
        Cleverbot.prepare(resolve, reject);
    });
}

Array.prototype.last = function() {
    return this[this.length-1];
}

process.on('unhandledRejection', console.log)

// boilerplate message
const boilerplateMessage = `Hey, how are you! You're really cute ${emoji.get('blush')}`;

/*       Actual Functionality      */


async function sayHelloToFirstMatch(){
  // let response = await client.getHistoryAsync();

  let response = await client.sendMessageAsync(id, `Hey, how are you! You're really cute ${emoji.get('blush')}`);

  console.log(response);
}

async function getHistoryData(){

  let data = await client.getHistoryAsync();

  console.log(  JSON.stringify(data, null, 2)  )
}



async function runMessageSendingFunctionality(){

  let data = await client.getHistoryAsync();

  await cleverbotPrepareAsync();

  let { matches } = data;

  _.forEach(matches, function(match, number){
    let timeout = number * 1000;
    let messages = match.messages;

    setTimeout(async function(){

      // conversation has been initiated
      if(messages.length){
        let lastMessage = messages.last();

        // I said last thing
        if(lastMessage.from == myTinderId){
          console.log('I sent the last message, nothing I can do here')
        // they said last thing
        } else {
          console.log('Send it to Cleverbot!')
          let messageToSendToCleverbot = lastMessage.message;
          let cleverbotResponse = await cleverbotWriteAsync(messageToSendToCleverbot); 
          console.log(`To the message of ${messageToSendToCleverbot}, cleverbot says ${cleverbotResponse.message}`) 
          let sendMessageResponse = await client.sendMessageAsync(match._id, cleverbotResponse.message);
          console.log(sendMessageResponse)
        }

      // no one has said anything yet, initiate conversation
      } else {
        console.log('No messages yet, fire the vanilla opener!')
        let sendMessageResponse = await client.sendMessageAsync(match._id, boilerplateMessage);
        console.log(sendMessageResponse)
      }
      
    }, timeout)

  })

}


async function main(){

  // if(!fbid || !fbtoken){
  //   const { fbtoken, fbid } = await tinderauth(email, password);
  //   console.log(fbtoken, fbid);
  // }

  client.authorize(fbtoken, fbid, async function(){
    runMessageSendingFunctionality()
  });

}

main()