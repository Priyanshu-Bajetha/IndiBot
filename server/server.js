import express from "express";
import * as dotenv from "dotenv"; //this will allow us to get data from that env file
import cors from "cors";
import OpenAI from "openai";

dotenv.config();

const openai = new OpenAI({
    apiKey: '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',
  });

const app = express(); //initialising our express
app.use(cors()); //cross-requests and allow our server to be called from the front end
app.use(express.json()); //alloww us to pass json from frontend to backend

app.get("/", async (req, res) => {
  //dummy route route , truly receive a lot of data from the frontend
  res.status(200).send({
    message: "Testing",
  });
});

app.post("/", async (req, res) => {
  //it allows us to have a body or a payload
  try {
    const prompt = req.body.prompt;
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `$${prompt}`,
      temperature: 0,
      max_tokens: 3000,
      top_p: 1,
      frequency_penalty: 0.5, //inorder to stop generating the same response/answer
      presence_penalty: 0,
    });

    res.status(200).send({
    bot: response.data.choices[0].text
    })


  } catch (error) {
    console.log(error);
    res.status(500).send({error})
  }
})

//taki hamara server hamesa request sune

app.listen(5000,()=>console.log('Server is Running on port http://localhost:5000'));