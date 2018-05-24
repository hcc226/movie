var mongoose = require('mongoose')
var MovieSchema = new mongoose.Schema({
    doctor:String,
    title:String,
    language:String,
    country:String,
    year:Number,
    summary:String,
    flash:String,
    poster:String,
    meta:{
        updateAt:{
            type:Date,
            default:Date.now()
        },
        createAt:{
         type:Date,
         default:Date.now()
     }
    }
})

MovieSchema.pre('save',function (next) {
   if(this.isNew){
       this.meta.createAt = this.meta.updateAt = Date.now()
   }
   else {
       this.meta.updateAt = Date.now()
   }
   next()
})

MovieSchema.statics = {
    fetch:function (cb) {
        //取出数据库所有数据
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb);
    },
    findById:function (id,cb) {
        return this
            .findOne({_id: id})
            .exec(cb);
    }

}

module.exports = MovieSchema