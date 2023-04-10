import express from "express";
import cors from "cors";
import mongoose from "mongoose";


const app = express();
app.use(express.urlencoded());
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/myLoginRegisterDB',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);


const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
})

const User = new mongoose.model("User", userSchema)


app.post("/login",async (req, res) => {
  const { email, password } = req.body
  const IsExist = await User.findOne({ email: email });
  if (IsExist) {
    if (password === IsExist.password) {
      res.send({ message: "Login Successfully", User: IsExist });
    } else {
      res.send({ message: "password did't match" });
    }
  } else {
    res.send({ message: "User not registered" });
  }
})

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body
  const IsExist = await User.findOne({ email: email });
  if (IsExist) {
    return res.send({ message: "User already register" });

  } else {

    const user = new User({
      name,
      email,
      password
    })
    let data = await user.save();
    res.send(data);
  }
})



app.listen(9002, () => {
  console.log("Be started at port 9002");
})