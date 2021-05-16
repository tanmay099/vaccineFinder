const axios = require("axios").default;
const format = require("date-fns/format");

/*creating axios instance for setting headers*/
const instance = axios.create({
  headers: {
    "Content-Type": "application/json",
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36",
  },
});

const district_id = 515; /*your district id*/
const pincode = 326001; /* your area pin code*/
(async function checkAvail(axios, pincode) {
  try {
    const results = await axios.get(
      "https://cdn-api.co-vin.in/api/v2/appointment/sessions/calendarByPin",
      {
        params: {
          pincode,
        //   district_id: dis_id,
          date: format(Date.now(), "dd-MM-yyyy"),
        },
      }
    );

    if (results.status === 200) {
      results.data.centers.forEach((center) =>
        center.sessions.forEach((session) => {
          if (session.min_age_limit === 18)
            session.available_capacity > 1
              ? console.log(
                  `${session.available_capacity} slot available at ${center.name} (${session.date})`
                )
              : console.log(
                  `No slot available at ${center.name} (${session.date})`
                );
        })
      );
      setTimeout(() => checkAvail(instance, pincode), 10000);
    } else {
      console.log(`Error occurred ${results.status}`);
      setTimeout(() => checkAvail(instance, pincode), 10000);
    }
  } catch {
    console.error;
    setTimeout(() => checkAvail(instance, pincode), 10000);
  }
})(instance, pincode);
