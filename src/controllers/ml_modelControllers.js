import axios from "axios";

export const latePrediction = async function (req, res, next) {
  const response = await axios
    .post("http://localhost:5000/predict/current", {
      UserId: req.body.UserId,
    })
    .then((response) => response.data);
  console.log(response);
  if (response.message === "No schedules found for user") {
    res.status(200).json({ message: "No schedules found for user" });
    return;
  }

  res.status(200).json(response);
};
