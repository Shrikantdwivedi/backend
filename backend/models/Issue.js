var mongoose = require('mongoose');

const Schema=mongoose.Schema;

const Issue=new Schema({
    title:{
        type:String
    },
    responsible:{
        type:String
    },
    description:{
        type:String
    },
    severity:{
        type:String
    },
    status:{
        type:String,
        default:'Open'
    }
});

 // needed to run node application through babel and command npm run dev,"build": "babel server.js --out-dir build"

module.exports= mongoose.model('Issue',Issue);