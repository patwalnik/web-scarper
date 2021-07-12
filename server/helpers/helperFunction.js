
import puppeteer from "puppeteer"
import { STATUS_CODES } from "../constants/server.code";
import APIError from "./apiError";
import CommentReviewModel from '../model/user.model'

const startBrowser = async () => {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--disable-setuid-sandbox"],
      'ignoreHTTPSErrors': true
    });
  } catch (err) {
    throw new APIError(err, STATUS_CODES.SERVER_ERROR, true)
  }
  return browser;
}


const scrapeAll = async (browserInstance, url) => {
  let browser;

  const scraperObject = {
    url,
    async scraper(browser) {
      //open browser page
      let page = await browser.newPage();
      // goto to url
      await page.goto(this.url);

      await page.st

      // wait for element to be fetched
      await page.waitForSelector("#review")
      
      // start scraping
      const links = await page.evaluate(() => {
        var titlesList = Array.from( document.querySelectorAll('.review blockquote'));
        var itemRatingList = Array.from( document.querySelectorAll('.review .itemRating'));
        var itemReviewerList = Array.from( document.querySelectorAll('.review .reviewer dd'));

       
        var movieArr = [];
        
        for (let i = 0 ; i < titlesList.length ; i++) {
          movieArr.push({
            reviewerName: itemReviewerList[i*2].textContent,
            commentTitle: titlesList[i].getElementsByTagName('h6')[0].textContent,
            comment : titlesList[i].textContent.split("\n").join(" "),
            overAllitemRating:  itemRatingList[i].textContent,
            reviewDate: itemReviewerList[i*2 + 1].textContent,
          } )
    
        }
        return movieArr;
      })

      return links
    }
  }

  try {
    browser = await browserInstance;
    let data = await scraperObject.scraper(browser);
    return data;
  }
  catch (err) {
    console.log(err)
    return null;
  }
}


const HelperFunction = {
  startBrowser,
  scrapeAll
};

export default HelperFunction;