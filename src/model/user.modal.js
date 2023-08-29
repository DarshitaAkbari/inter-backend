const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    bod: {
      type: String,
      required: true,
    },
    age: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phone_no: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    followers: [{ type: Object, ref: "User" }],
    following: [{ type: Object, ref: "User" }],
    followRequests: [
      {
        user: { type: Object, ref: "User" },
        first_name: { type: Object, ref: "User" },
        last_name: { type: Object, ref: "User" },
        email: { type: Object, ref: "User" },
        status: {
          type: String,
          enum: ["pending", "accepted"],
          default: "pending",
        },
      },
    ],
  },
  { timestamps: true },
  { collection: "user" }
);

userSchema.methods.generateToken = async function () {
  try {
    const token = jwt.sign({ _id: this._id }, "darshita akbari");
    this.token = token;
    await this.save();
    return token;
  } catch (error) {
    console.log("error", error);
  }
};

module.exports = mongoose.model("user", userSchema);
