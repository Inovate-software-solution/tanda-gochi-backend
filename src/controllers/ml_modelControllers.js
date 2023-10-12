import axios from "axios";
import User from "../schemas/User";

export const latePrediction = async function (req, res, next) {
  const user = await User.findOne({ Email: req.body.Email });
  const response = await axios
    .post("http://localhost:5000/predict", {
      UserId: req.body.EmployeeId,
    })
    .then((response) => response.data);
  if (response.message === "No schedules found for user") {
    res.status(200).json({ message: "No schedules found for user" });
    return;
  }

  res.status(200).json(response);
};
