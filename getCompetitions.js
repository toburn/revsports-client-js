var moment = require('moment-timezone');
var CryptoJS = require("crypto-js");

doTheCall()

async function doTheCall() {
    var api_key = process.env.API_KEY;  // Set your API  key as an env variable
    var api_secret = process.env.API_SECRET;

    // At least for version 1 of the api, the date must be in Australia/Sydney timezone.
    // Assuming it must be the same for v2 of the api
    //var currentdate = moment().format(("DD MMM YYYY HH:mm:ss"));  // any timestamp in this format is accepted
    var currentdate = moment().tz("Australia/Sydney").format(("DD MMM YYYY HH:mm:ss"));
    var nonce  =  Math.random(100000,999999);

    var signatureRawData = "GET+/competitions/+" + currentdate.split(" ").join("") + "+" + nonce;
    var digest = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(CryptoJS.HmacSHA256(signatureRawData, api_secret)));

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("digest", digest);
    urlencoded.append("api_key", api_key);
    urlencoded.append("nonce", nonce);
    urlencoded.append("date", currentdate);

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow'
    };

    // For v1 of the api there must /v1 in the endpoint
    //var url = "https://lz-1.revolutionise.com.au/outbound/v1/competitions"
    // We skip it for v2. And replace lz-1 with lz-2
    var url = "https://lz-2.revolutionise.com.au/outbound/competitions"
    var response = await fetch(url, requestOptions);
    console.log(response)
    if (response.ok) {
        var data = await response.json();
        console.log(JSON.stringify(data, null, 2))
    } else {
        console.log(await response.text())
    }
}