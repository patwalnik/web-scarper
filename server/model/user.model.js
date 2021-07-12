// import mongoose from "mongoose";
// const userSchema = mongoose.Schema({
//   username: {
//     name: String
//   },
//   email: {
//     type: String,
//     index: {
//       unique: true
//     }
//   },
//   mobile: {
//     type: Number
//   },
//   refercode: {
//     type: String
//   },
//   waitlist: {
//     type: Number
//   },
//   referralLink: {
//     type: String
//   },
//   creationDate: {
//     type: Number,
//     default: Date.now()
//   }
// });

// export default mongoose.model("users", userSchema);
//define user model here

export default class CommentReviewModel{
    
    constructor(reviewerName,  commentTitle, comment, overAllitemRating, reviewDate)
        {
            this.reviewerName = reviewerName
            this.commentTitle = commentTitle,
            this.comment = comment,
            this.overAllitemRating = overAllitemRating,
            this.reviewDate = reviewDate
        }

        get data() {
            return this.addData();
        }
    
        addData(){
           return {
                reviewerName:  this.reviewerName,
                commentTitle: this.commentTitle,
                comment: this.comment,
                overAllitemRating: this.overAllitemRating,
                reviewDate: reviewDate
            }
        }

}