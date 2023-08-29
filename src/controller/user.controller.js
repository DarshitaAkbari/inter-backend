const { genSaltSync } = require("bcrypt");
const userModal = require("../model/user.modal");
const bcrypt = require("bcrypt");
const { request } = require("http");

exports.userRegister = async (req, res) => {
  try {
    const data = await userModal.findOne({ email: req.body.email });
    if (!data) {
      if (req.body.password == req.body.confirm_password) {
        const User = new userModal({
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          bod: req.body.bod,
          age: req.body.age,
          address: req.body.address,
          phone_no: req.body.phone_no,
          email: req.body.email,
          password: bcrypt.hashSync(req.body.password, genSaltSync(8), null),
          confirm_password: req.body.confirm_password,
        });

        const saveData = await User.save();
        console.log("register user data", saveData);

        res.status(200).json({
          message: "USER REGISTERED SUCCESSFULLY",
          status: 200,
          data: saveData,
        });
      } else {
        res.status(400).json({
          message: "COMFIRM PASSWORD DOES NOT MATCH WITH PASSWORD",
          status: 400,
        });
      }
    } else {
      res.status(409).json({
        message: "EMAIL ALREADY REGISTERED",
        status: 409,
      });
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      message: "SOMETHING WENT WRONG",
      status: 500,
    });
  }
};

exports.viewAllUsers = async (req, res) => {
  try {
    const logInUser = req.body.userID;
    console.log("logInUser", logInUser);
    const userData = await userModal.find({ _id: { $ne: logInUser } });
    if (userData.length > 0) {
      res.status(200).json({
        message: "SUCCESSFULLY GET REGISTERED USER DATA",
        status: 200,
        data: userData,
      });
    } else {
      res.status(404).json({
        message: "USER NOT FOUND",
        status: 404,
      });
    }
  } catch (error) {
    console.log("ERROR", error);
    res.status(500).json({
      message: "SOMETHING WENT WRONG",
      status: 500,
    });
  }
};

exports.userLogin = async (req, res) => {
  try {
    const password = req.body.password;
    const data = await userModal.findOne({ email: req.body.email });
    if (data) {
      const token = await data.generateToken();
      res.cookie("jwt", token, {
        expires: new Date(Date.now() + 30000 * 3),
        httpOnly: true,
      });
      bcrypt.compare(password, data.password, (err, data) => {
        if (data) {
          return res.status(200).json({
            message: "LOGIN SUCCESSFULLY",
            status: 200,
            data: token,
          });
        } else {
          res.status(401).json({
            message: "INVAILD CREDENTIAL",
            status: 401,
          });
        }
      });
    } else {
      res.status(404).json({
        message: "USER NOT FOUND",
        status: 404,
      });
    }
  } catch (error) {
    console.log("Error", error);
    res.status(500).json({
      message: "SOMWTHING WENT WRONG",
      status: 500,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const data = await userModal.findById({ _id: req.params.id });
    if (data) {
      const result = await userModal.findByIdAndDelete({ _id: req.params.id });
      res.status(200).json({
        message: "USER DELETED SUCCESSFULLY",
        status: 200,
      });
    } else {
      res.status(404).json({
        message: "USER NOT FOUND",
        status: 404,
      });
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      message: "SOMETHING WENT WRONG",
      status: 500,
    });
  }
};

exports.userDetails = async (req, res) => {
  try {
    const userData = await userModal.findById({ _id: req.params.id });
    if (userData) {
      res.status(200).json({
        message: "USER DETAULS VIEW SUCCESSFULLY",
        status: 200,
        data: userData,
      });
    } else {
      res.status(404).json({
        message: "USER NOT FOUND",
        status: 404,
      });
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      message: "SOMETHING WENT WRONG",
      status: 500,
    });
  }
};

exports.sendRequest = async (req, res) => {
  try {
    const currentUser = await userModal.findById(req.body.currentUserId);
    const targetUser = await userModal.findById(req.params.userID);

    console.log("user", currentUser);

    if (!currentUser || !targetUser) {
      return res.status(404).json({
        message: "USER NOT FOUND",
        status: 404,
      });
    }

    if (currentUser.followers.includes(targetUser._id)) {
      return res.status(400).json({
        message: "YOU ARE ALREADY FOLLOWING THIS USER",
        status: 400,
      });
    }

    targetUser.followers.push(currentUser); // Push the current user's _id

    await targetUser.save(); // Save the modified targetUser

    const existingRequest = currentUser.followRequests.find(
      (request) => request.user.toString() === targetUser._id.toString()
    );

    if (!existingRequest) {
      currentUser.followRequests.push({
        user: targetUser._id,
        first_name: targetUser.first_name,
        last_name: targetUser.last_name,
        email: targetUser.email,
        status: "pending",
      });
      await currentUser.save();
    }

    res.status(200).json({
      message: "REQUEST SENT SUCCESSFULLY",
      status: 200,
    });
  } catch (error) {
    console.log("Error", error);
    res.status(500).json({
      message: "SOMETHING WENT WRONG",
      status: 500,
    });
  }
};

// exports.acceptRequest = async (req, res) => {
//   try {
//     const currentUser = await userModal.findById(req.params.userID); // The user who sent the request
//     const targetUser = await userModal.findById(req.body.currentUserId);
//     console.log("User: " + JSON.stringify(targetUser.followers));

//     if (!currentUser || !targetUser) {
//       return res.status(404).json({
//         message: "USER NOT FOUND",
//         status: 404,
//       });
//     }

//     const existingRequest = targetUser.followRequests.find(
//       (request) => request.user._id.toString() === currentUser._id.toString()
//     );
//     console.log("Follow Requests:", targetUser.followRequests);
//     console.log("Request:", existingRequest);

//     if (!existingRequest || existingRequest.status !== "pending") {
//       return res.status(400).json({
//         message: "NO PENDING REQUEST FROM THIS USER",
//         status: 400,
//       });
//     }

//     existingRequest.status = "accepted";
//     await targetUser.save();

//     currentUser.following.push({
//       _id: targetUser._id,
//       first_name: targetUser.first_name,
//       last_name: targetUser.last_name,
//       email: targetUser.email,
//     });

//     await currentUser.save();

//     res.status(200).json({
//       message: "REQUEST ACCEPTED SUCCESSFULLY",
//       status: 200,
//     });
//   } catch (error) {
//     console.log("ERROR", error);
//     res.status(500).json({
//       message: "SOMETHING WENT WRONG",
//       status: 500,
//     });
//   }
// };

exports.acceptRequest = async (req, res) => {
  try {
    const currentUser = await userModal.findById(req.params.userID); // The user who sent the request
    const targetUser = await userModal.findById(req.body.currentUserId);
    console.log("User: " + JSON.stringify(targetUser.followers));

    console.log("targetUser:::", targetUser.first_name);

    if (!currentUser || !targetUser) {
      return res.status(404).json({
        message: "USER NOT FOUND",
        status: 404,
      });
    }

    const existingRequest = currentUser.followRequests.find(
      (request) => request.user.toString() === targetUser._id.toString()
    );
    console.log("Follow Requests:", currentUser.followRequests);
    console.log("Request:", existingRequest);

    if (!existingRequest || existingRequest.status !== "pending") {
      return res.status(400).json({
        message: "NO PENDING REQUEST FROM THIS USER",
        status: 400,
      });
    }

    existingRequest.status = "accepted";
    await currentUser.save();

    currentUser.following.push({
      _id: targetUser._id,
      first_name: targetUser.first_name,
      last_name: targetUser.last_name,
      email: targetUser.email,
    });

    await currentUser.save();

    targetUser.following.push({
      _id: currentUser._id,
      first_name: currentUser.first_name,
      last_name: currentUser.last_name,
      email: currentUser.email,
    });

    await targetUser.save();

    currentUser.followRequests = currentUser.followRequests.filter(
      (request) => request.user.toString() !== targetUser._id.toString()
    );
    await currentUser.save();

    res.status(200).json({
      message: "REQUEST ACCEPTED SUCCESSFULLY",
      status: 200,
    });
  } catch (error) {
    console.log("ERROR", error);
    res.status(500).json({
      message: "SOMETHING WENT WRONG",
      status: 500,
    });
  }
};
