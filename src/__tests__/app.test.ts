import request from "supertest";

import app from "../app";

describe("Test app.ts", () => {
  test("Catch-all route", async () => {
    const res = await request(app).get("/");
    expect(res.body).toEqual({ message: "Allo! Catch-all route." });
  });
});
// describe("User routes", () => {
//   test("Get all users", async () => {
//     const res = await request(app).get("/users");
//     expect(res.body).toEqual(["Goon", "Tsuki", "Joe"]);
//   });
// });
