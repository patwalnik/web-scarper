import { stat } from "fs";

/** 
 * @extends Error
 */

 class ExtendableError extends Error{
     constructor(message, status, isPublic){
         super(message);
         this.name = this.constructor.name;
         this.message = message;
         this.status = status;
         this.isPublic = isPublic;
         this.isOperational = true;
         Error.captureStackTrace(this, this.constructor.name)
     }
 }

 /**
  * class respresenting an API error
  * @extends ExtendableError
  * 
  */
 class APIError extends ExtendableError{
     /**
      * creates an API Error
      * @param {string} message - error message
      * @param {number} status - HTTP status code of error
      * @param {boolen} isPublic - wheteher the message should be visible to user or not
      */
     constructor(message, status = 500, isPublic=true){
         super(message,status,isPublic)
     }
 }

 export default APIError;