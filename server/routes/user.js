import express from "express";
const user = express.Router();
import userHelper from "../controller/user.controller";
import Validation from "../validation/user.validator";


user.post("/scrap", Validation.scrapValidator ,userHelper.fetchUserReviews)

export default user;
