const mongoose= require('mongoose');
objectId=mongoose.Schema.Types.objectId
const bookSchema= new Schema({
    title: {
        type: String,
      required: true,
      trim: true
    },
  excerpt: {
    type: String,
    required: true,
    trim: true
}, 
  userId: {type:ObjectId,
    required: true,
    ref: 'User' },
  ISBN: {
    type:String,
      required: true,
      trim: true,
      unique: true,
  },
  category: {
    type:String,
      required: true,
      trim: true,
  },
  subcategory: {
    type:[String],
      required: true,
      trim: true,
  },
  reviews: {
    type:number,
    default: 0
},
  deletedAt: Date, 
  isDeleted: {
    type:boolean, 
    default: false
},
  releasedAt: {
    type:Date, 
    required: true},
  },
  { timestamps: true })
  module.exports=mongoose.model("books",bookSchema)
