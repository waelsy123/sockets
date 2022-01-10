import Express from "express";
import dateInfo from "./domain/dateInfo";
const router = Express.Router();

router.get("/", (req, res) => res.send("Hello world!"));

router.get("/date/:dateParam", async (req, res, next) => {
  const { dateParam } = req.params;
  dateInfo
    .fetchInfo(dateParam)
    .then(result => res.json(result))
    .catch(next);

  // try {
  //   const dateInfoResult = await dateInfo.fetchInfo(dateParam);
  //   res.json(dateInfoResult);
  // } catch (error) {
  //   next(error);
  // }
});

export default router;
