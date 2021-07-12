import HelperFunction from "../helpers/helperFunction";
import Handler from "../helpers/responseHandler";
import { STATUS_CODES, STATUS_MESSAGE } from "../constants/server.code";
import APIError from "../helpers/apiError";


const fetchUserReviews = async (req, res, next) => {
  try {
    const { url } = req.body

    const browserInstance = HelperFunction.startBrowser()
    let data = await HelperFunction.scrapeAll(browserInstance, url);
    
    if(!data) {
      return res.json(Handler.response(STATUS_MESSAGE.URL_PAGE_NOT_FOUND, STATUS_CODES.NOTFOUND, data));
    }
    
    res.json(Handler.response(STATUS_MESSAGE.SUCCESS, STATUS_CODES.SUCCESS, data));
  } catch (error) {
    const err = new APIError(error)
    next(err)
  }

}

const userHelper = {
  fetchUserReviews
};
export default userHelper;
