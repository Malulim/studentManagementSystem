const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var url = 'mongodb+srv://malulim:8229553yzy@cluster0.eluaukv.mongodb.net/myDB?retryWrites=true&w=majority';
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true },
    function (error) {
        if (error) console.log(error);
        else console.log("connection successful");
    }
);

var userSchema = new Schema({ 'uName':  { type: Number, /* default: 0 */ }, 'pswd':String});
var User = mongoose.model("users", userSchema);

exports.createUser=(user)=>{
    return new Promise((rs,rj)=>{
        var newUser = new User(user);
        newUser.save((err)=>{
            /* if (err) rs(`Error in saving ${newUser.uName}`);
            else rj(`Success, saved ${newUser.uName}`);
        }); */
    });
}