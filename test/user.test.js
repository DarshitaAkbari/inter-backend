const request = require("supertest");
const app = require("../app.js");

describe("User API testing", () => {
  it("should get a list of users", async () => {
    const response = await request(app).get("/user/viewAll");
    console.log("ddddddd", response.text);
    expect(response.status).toBe(200);
  });

  it("should get user by its id", async () => {
    const response = await request(app).get(
      "/user/viewById/64d36521cdc7adb8e27728f4"
    );
    console.log("gggg", response.text);
    expect(response.status).toBe(200);
  });

  it("should register new users", async () => {
    const newUser = {
      first_name: "g",
      last_name: "patel",
      bod: "1990-01-01",
      age: 31,
      address: "123 Main St",
      phone_no: "1234567890",
      email: "gj@example.com",
      password: "123456",
      confirm_password: "123456",
    };
    const response = await request(app).post("/user/register").send(newUser);
    console.log("response", response.text);
    expect(response.status).toBe(200);
  });

  it("should match email and password", async () => {
    const newUser = {
      first_name: "labh",
      last_name: "patel",
      bod: "1990-01-01",
      age: 31,
      address: "123 Main St",
      phone_no: "1234567890",
      email: "labkl@example.com",
      password: "987456",
      confirm_password: "98745676",
    };

    const response = await request(app).post("/user/register").send(newUser);
    console.log("response", response.text);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "COMFIRM PASSWORD DOES NOT MATCH WITH PASSWORD"
    );
  });
});
