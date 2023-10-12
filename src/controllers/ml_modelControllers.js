const { spawn } = require("child_process");

export const latePrediction = async function (req, res, next) {
  const userId = req.query.userId;

  // Command to activate conda environment and run Python script
  const command = `
        eval "$(conda shell.bash hook)" &&
        conda activate mycondaenv && 
        python predict_late.py ${userId}
    `;

  // Execute the command within a shell
  const pythonProcess = spawn("/bin/bash", ["-c", command]);

  pythonProcess.stdout.on("data", (data) => {
    res.send(data.toString());
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  pythonProcess.on("close", (code) => {
    if (code !== 0) {
      res
        .status(500)
        .send("An error occurred while executing the Python script.");
    }
  });
};
