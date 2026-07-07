const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title:{
        type:String,
        required: true,
    },
    author:{
        type:String,
        required: true,
    },
    isAvailable:{
        type:Boolean,
        default:true
    },
    quantity:{
        type:Number,
        required:true,
        min:0
    },
    category:{
        type:String,
        required:true,
        enum:['Fiction', 'Non-Fiction', 'Science', 'History', 'Biography', 'Children', 'Fantasy', 'Mystery', 'Romance', 'Horror']   
    }
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);