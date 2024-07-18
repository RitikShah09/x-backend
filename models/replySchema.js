const mongoose = require("mongoose");

var replySchema = new mongoose.Schema(
  {
    comment: { type: mongoose.Schema.Types.ObjectId, ref: "comment" },
    text: String,
    userid: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    like: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("reply", replySchema);
