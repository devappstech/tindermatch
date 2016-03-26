import tinderauth from 'tinderauth';

process.on('unhandledRejection', console.log)

let email = process.env.FACEBOOK_EMAIL;
let password = process.env.FACEBOOK_PASSWORD;

(async function(){
  const { token, profile_id } = await tinderauth(email, password);
  console.log(token, profile_id);
})();