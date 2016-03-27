import tinderauth from 'tinderauth';

process.on('unhandledRejection', console.log)

let email = process.env.FACEBOOK_EMAIL;
let password = process.env.FACEBOOK_PASSWORD;

console.log(email, password)

if(!email || !password){
  console.log('undefined env vars')
  process.exit()
}

(async function(){
  const { token, profile_id } = await tinderauth(email, password);
  console.log(token, profile_id);
  process.exit()
})();