
var mongoose = require("mongoose");

var commentSchema = new mongoose.Schema(
  {
    userid: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    text: String,
    like: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    reply: [{ type: mongoose.Schema.Types.ObjectId, ref: "reply" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("comment", commentSchema);