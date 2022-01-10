import fetch from "node-fetch";
import moment from "moment";

const getNameDayApiUrl = (day: string, month: string, countryCode: string) =>
  `https://api.abalin.net/get/namedays?day=${day}&month=${month}&country=${countryCode}`;

class DateInfo {
  async fetchInfo(dateString: string): Promise<any> {
    const dateIsValid = moment(dateString).isValid();
    if (dateIsValid === false) {
      throw Error("Invalid date given");
    }
    const date = moment(dateString);
    const day = date.format("D");
    const month = date.format("M");
    console.log(`-> fetching name days for day ${day} and month ${month}`);
    const nameDayApiUrl = getNameDayApiUrl(day, month, "se");
    const response = await fetch(nameDayApiUrl);
    const jsonResult = await response.json();
    console.log(`-> fetching done.`);
    return jsonResult.data;
  }
}

const dateInfo = new DateInfo();
export default dateInfo;
