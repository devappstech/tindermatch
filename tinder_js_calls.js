import tinder from 'tinder';
import Promise from 'bluebird';
import _ from 'lodash';
import tinderauth from 'tinderauth';
import emoji from 'node-emoji'

process.on('unhandledRejection', console.log)

const client = Promise.promisifyAll(new tinder.TinderClient());

const email = process.env.FACEBOOK_EMAIL
const password = process.env.FACEBOOK_PASSWORD

let fbid = process.env.FACEBOOK_ID;
let fbtoken = process.env.FACEBOOK_TOKEN;

console.log(client)

async function main(){

  client.authorize(fbtoken, fbid, async function(){
    let response = await client.getProfileAsync();
    console.log(response)
  });

}

main()