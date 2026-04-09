const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI('AIzaSyCVbehD8llBy8ycnpURa7gk1iGsvOiGcxk');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
model.generateContent('Say hello').then(res => {
    console.log("SUCCESS");
    console.log(res.response.text());
}).catch(err => {
    console.error("ERROR CAUGHT:");
    console.error(err);
    if(err.status) console.error("Status:", err.status);
    if(err.statusText) console.error("StatusText:", err.statusText);
});
