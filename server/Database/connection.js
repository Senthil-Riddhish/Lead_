//Sv02RDzCvIA6ctqX
import mongoose from "mongoose";

export default async () => {
  return mongoose.connect("mongodb+srv://Sujith:Sv02RDzCvIA6ctqX@cluster0.g3igd2e.mongodb.net/LeadDB?retryWrites=true&w=majority&appName=Cluster0", {});
};
