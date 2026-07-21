const User = require("../models/User")
const bcrypt = require(bcrypt)
let userController = {
  register: async (req, res) => {
    console.log(req.body)
    let { username, email, password, role, contact, age } = req.body
    try {
      if (!username || !email || !password) {
        return res.json({
          message: "Required fields are missing",
          status: false
        })
      }
      else {
        let existingUser = await user.findone({ email })
        console.log(existingUser)
        if (existingUser) {
          return res.json({
            message: "Account already exist with this email ",
            status: false
          })
        }
        else {
          let hashPass = await bcrypt.hash(password, 10)
          console.log(hashPass)
          let newUser = await User.create({ username, email, password, role, contact, age })

          return res.json({
            message: "Account created",
            status: true,
            newUser
          })

        }
      }


    } catch (error) {
      res.json({
        message: error.messaage,
        status: false
      })

    }
  },
  login: async (req, res) => {
    let {eamil,password}= req.body
    try {
if (!email || !password) {
    return res.json({
        message: "Required fiels missng",
        status: false
      })
  
} else {
  let existingUser= await user.findone({email})
  if (!existingUser) {
     return res.json({
        message: "No account exist",
        status: false
      })
  }
   else {
    let isPassMatch = await  bcrypt.compare(password,existingUser.password)
    if (isPassMatch) {
        return res.json({
        message: "Login Successful",
        status: true,
        user: existingUser
      })
    } else {
       res.json({
        message: "invalid password",
        status: false
      })
    }
  }
}
    } catch (error) {
      res.json({
        message: error.messaage,
        status: false
      })

    }
  }
}
////chat gpt code//
const User = require("../models/User");

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};