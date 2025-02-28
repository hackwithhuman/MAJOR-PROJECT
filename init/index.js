const mongoose = require('mongoose');
let initdata = require('./data.js');
const Listing = require('../models/listing.js');




const MONGO_URL = 'mongodb://127.0.0.1:27017/wonderlust';

main().then((res)=>{console.log('connection successful')})
.catch(err => console.log(err));

async  function main(){
    await mongoose.connect(MONGO_URL);
}

const   initDb = async () =>{
    await Listing.deleteMany({});
   
    initdata.data.map((obj)=>({...obj , owner:'66a347498659a2bc8957abd8' }));
   initdata.data = initdata.data.map((obj) => ({...obj, owner:'66ad2527c726610bab851903'}));
    
    await Listing.insertMany(initdata.data);
    console.log("data inserted successfully");

}

initDb();