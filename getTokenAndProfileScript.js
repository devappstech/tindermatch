import Browser from 'zombie'
import cheerio from 'cheerio'

let FACEBOOK_PROFILE = "http://www.facebook.com/"
let FACEBOOK_AUTHENTICATION_TOKEN_URL = 'https://www.facebook.com/dialog/oauth?client_id=464891386855067&redirect_uri=https://www.facebook.com/connect/login_success.html&scope=basic_info,email,public_profile,user_about_me,user_activities,user_birthday,user_education_history,user_friends,user_interests,user_likes,user_location,user_photos,user_relationship_details&response_type=token'

let email = process.env.FACEBOOK_EMAIL
let password = process.env.FACEBOOK_PASSWORD

let scraped_token, profile_id;

let browser = new Browser()

browser.on('loaded', function(){

    var t = browser.url.match(/#access_token=(.+)&/)

    if (t && t[1]){
        console.log(t[1])
    }
})

browser.visit(FACEBOOK_AUTHENTICATION_TOKEN_URL, function () {

    browser.fill('#email', email).fill('#pass', password).pressButton('#loginbutton', function(){

        browser.visit(FACEBOOK_PROFILE, function(){

            let $ = cheerio.load(browser.html())

            var profile_id = $('[title=Profile]').attr('href')

            let profile_id_number = profile_id.match(/profile.php\?id=(.+)/)

            console.log(profile_id_number[1])

        })

    })
 
});