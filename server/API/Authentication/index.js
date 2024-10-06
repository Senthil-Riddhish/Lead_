//Library
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//Models
import { UserModel } from "../../Database/Admin";

// Validation
import { ValidateSignup, ValidateSignin } from "../../Validation/authentication";

const Router = express.Router();

/*
Route     /signup
Des       Register new user
Params    none
Access    Public
Method    POST  
*/
Router.post("/signup", async (req, res) => {
    try {
      await ValidateSignup(req.body.credentials);
      console.log("Successfully validated");
      await UserModel.findByEmailAndPhone(req.body.credentials);
      console.log();
      const newUser = await UserModel.create(req.body.credentials);
      //const token = newUser.generateJwtToken();
      return res.status(200).json({ message : "Successfully Admin Signup", status: "success" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
});

  /*
  Route     /signin
  Des       Signin with email and password
  Params    none
  Access    Public
  Method    POST  
  */
Router.post("/signin", async (req, res) => {
    try {
      await ValidateSignin(req.body.credentials);
      
      const user = await UserModel.findByEmailAndPassword(req.body.credentials);
  
      const token = user.generateJwtToken();
      return res.status(200).json({ token, status: "success" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
});

export default Router;