const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserRepository = require("../repositories/user_repository");

class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  //Register
  async registerUser(data) {
    const user = await this.userRepository.registerUser(data);
    return user;
  }

  //GetUsers
  async getUsers() {
    const users = await this.userRepository.getUsers();
    return users;
  }

  //Login
  async login(email, password) {
    // Validate if user exist in our database
    try {
      const user = await this.userRepository.userEmail(email);

      if (
        user &&
        (await bcrypt.compare(password, user.password)) &&
        user.active
      ) {
        // Create token
        const token = jwt.sign(
          { user_id: user._id, email },
          process.env.TOKEN_KEY,
          {
            expiresIn: "2h",
          }
        );
        let first_name = user._doc.first_name;
        let last_name = user._doc.last_name;
        let nick = user._doc.nick;
        let rol = user._doc.rol;
        let mail = user._doc.email;
        let expires = new Date(Date.now());
        expires = expires.setHours(expires.getHours() + 12);
        // user
        return {
          first_name,
          last_name,
          nick,
          rol,
          email: mail,
          token,
          expires: expires,
        };
      } else {
        throw new Error();
      }
    } catch (err) {
      throw new Error();
    }
    // Our register logic ends here
  }

  //Reset
  async reset(email, password) {
    const user = await this.userRepository.userEmail(email);

    encryptedPassword = await bcrypt.setRandomFallback(password, 10);

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

    return info;
  }

  //EditUser
  async editUser(data) {
    const newUser = await this.userRepository.editUser(data);
    return newUser;
  }

  async editUserStatus(data) {
    const editUser = await this.userRepository.editUserStatus(data);
    return editUser;
  }
}

module.exports = UserService;
