import { STATUS_CODES, STATUS_MESSAGE } from "../constants/server.code"
import APIError from "../helpers/apiError"

const scrapValidator = (req, res, next) => {
    const {url} = req.body
    if(!url) {
        const err = new APIError(STATUS_MESSAGE.VALIDATIONERROR, STATUS_CODES.VALIDATIONERROR)
        res.json(err)
    }
    next()
}

const Validation = {
    scrapValidator
}

export default Validation