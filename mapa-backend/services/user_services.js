const User = require("../models/user_model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//Register
async function registerUser(req, res) {
  try {
    const {
      first_name,
      last_name,
      nick,
      roles,
      password,
      email,
      active,
      DNI,
      DNI_Type,
      hasChangePassword,
    } = req.body;

    if (
      !(
        first_name &&
        last_name &&
        nick &&
        roles &&
        password &&
        email &&
        DNI &&
        DNI_Type
      )
    ) {
      return res.status(403).send("All fields are required");
    }

    encryptedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      first_name,
      last_name,
      nick,
      roles,
      password: encryptedPassword,
      email: email.toLowerCase(),
      active,
      DNI,
      DNI_Type,
      hasChangePassword,
    });

    const userStored = await user.save();

    res.status(201).send({ userStored });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
}

//GetUsers
async function getUsers(req, res) {
  const usuarios = await User.find().lean().exec();
  res.status(200).send({ usuarios });
}

//Login
async function login(req, res) {
  // Our login logic starts here
  try {
    // Get user input
    const authHeader = req.headers.authorization;

    let email, password;
    if (authHeader) {
      const method = authHeader.split(" ")[0];
      const token = authHeader.split(" ")[1];
      if (method && method === "Basic" && token) {
        const b = Buffer.from(token, "base64");
        const value = b.toString().split(":");
        email = value[0];
        password = value[1];
      }
    }

    // Validate user input
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      // user
      return res.status(200).json({ ...user._doc, token });
    }
    return res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
}

//Reset
async function reset(req, res) {
  try {
    const { ID } = req.params;

    encryptedPassword = await bcrypt.setRandomFallback(password, 10);

    const user = await Users.findOne({ ID });

    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const info = await transporter.sendMail({
      from: "enzoefica@gmail.com",
      to: user.email,
      subject: "Hello ✔",
      text: "Hello world?",
      html: "<b>Hello world?</b>",
    });

    res.status(201).send({ info });

    res.json(req.body);
  } catch (err) {
    console.log(err);
  }
}

//EditUser
async function editUser(req, res) {
  try {
    const { first_name, last_name, nick, roles, email, DNI, DNI_Type } =
      req.body;

    const data = {
      first_name: first_name,
      last_name: last_name,
      nick: nick,
      roles: roles,
      email: email,
      DNI: DNI,
      DNI_Type: DNI_Type,
    };

    await User.findByIdAndUpdate({ _id: req.params.id }, data);

    const userStored = await User.findById(req.params.id);

    res.status(201).send({ userStored });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
}

module.exports = {
  registerUser,
  getUsers,
  reset,
  editUser,
  login,
};
