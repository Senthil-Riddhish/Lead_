//Env Variables
require("dotenv").config();

//Libraries
import express from 'express';
import pkg from 'body-parser';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';

// Database connection
import ConnectDB from "./Database/connection";

//application middlewares
const port ="8000";
const lead = express();
console.log(process.env);
lead.use(cors());
lead.use(express.json());
lead.use(express.urlencoded({ extended: false }));
lead.use(helmet());

// microservice route
import Auth from "./API/Authentication";

// Application Routes
lead.use("/auth", Auth);

lead.get("/" , (req, res) => res.json({ message: "Setup success" }));

lead.listen(port, () =>
    ConnectDB()
    .then(() => console.log("Server is running"))
    .catch(() =>
      console.log("Server is running, but database connection failed.")
    )
);