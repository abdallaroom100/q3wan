import mongoose from "mongoose";


const commentSchema = new mongoose.Schema({
  name: { type: String, default: "" },
  comment: { type: String, default: "" },
}, { _id: false });



const commentsSchema = new mongoose.Schema({
  reviewer: { type: commentSchema, default: () => ({}) },
  committee: { type: commentSchema, default: () => ({}) },
  manager: { type: commentSchema, default: () => ({}) },
}, { _id: false });




const reportModel = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Q3wanUser",
      required: true,
    },
    status: {
      type: String,
      enum: ["under_review", "under_committee", "under_manager","done"],
      required: true,
    },
    comments: {
      type: commentsSchema,
      default: () => ({})
    },
    reportStatus: {
      type: String,
      enum: ["rejected", "accepted", "","rejected_manager","accepted_manager"],
      default: ""
    }
  },
  {
    timestamps: true,
  }
);


const Report = mongoose.model("Q3wanReport", reportModel);
export default Report;
