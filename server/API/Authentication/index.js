//Library
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//Models
import { UserModel } from "../../Database/Admin";
import EmployeeModel from "../../Database/EmployeeData";

// Validation
import { ValidateSignup, ValidateSignin } from "../../Validation/authentication";
import {ValidateEmployee} from "../../Validation/employeeValidation";

import generateJwtToken from "../../Utils/generateJwtToken";

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
      await UserModel.findByEmailAndPhone(req.body.credentials);
      const newUser = await UserModel.create(req.body.credentials);
      //const token = newUser.generateJwtToken();
      return res.status(200).json({ message : "Successfully Admin Signup", status: "success" });
    } catch (error) {
        const statusCode = error.statusCode || 500; // Default to 500 if no status code is provided
        const message = error.message || "Internal Server Error";
        return res.status(statusCode).json({ error: message });
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
      console.log("validation completed");
      
      const user = await UserModel.findByEmailAndPassword(req.body.credentials);
        console.log(user);
        
      // Pass the role (0 or 1) to the token generation function
      const token = generateJwtToken(user._id.toString(), user.role); 
      
      return res.status(200).json({ token, status: "success" });
    } catch (error) {
      // Check if the error is an instance of our custom ErrorResponse class
      const statusCode = error.statusCode || 500; // Default to 500 if no status code is provided
      const message = error.message || "Internal Server Error";
      return res.status(statusCode).json({ error: message });
    }
});  

Router.post("/create-emp", async(req,res)=>{
    try {
        await ValidateEmployee(req.body.credentials)
        console.log("validation complete");
        await EmployeeModel.findByEmailAndPhone(req.body.credentials)
        console.log("findByEmailAndPhone complete");
        const newEmp = EmployeeModel.create(req.body.credentials)
        return res.status(200).json({ message : "Employee Added Successfully", status: "success" });
    }catch(error){
        const statusCode = error.statusCode || 500; // Default to 500 if no status code is provided
        const message = error.message || "Internal Server Error";
        return res.status(statusCode).json({ error: message });
    }

})

export default Router;