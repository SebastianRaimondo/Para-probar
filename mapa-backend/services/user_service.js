const User = require("../models/user_model");
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
    const user = await this.userRepository.userEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
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
      let role = user._doc.rol;
      let mail = user._doc.email;
      // user
      return { first_name, last_name, role, email: mail, token };
    }
    return null;
    // Our register logic ends here
  }

  //Reset
  async reset(req, res) {
    const users = await this.userRepository.reset();
    return users;
  }

  //EditUser
  async editUser(data) {
    const newUser = await this.userRepository.editUser();
    return newUser;
  }
}

module.exports = UserService;
