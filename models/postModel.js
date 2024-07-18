var mongoose = require("mongoose");

var postSchema = new mongoose.Schema(
  {
    userid: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    postImage: {
      type: Object,
      default: {
        fileId: "",
        url: "",
      },
    },
    text: String,
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    comment: [{ type: mongoose.Schema.Types.ObjectId, ref: "comment" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("post", postSchema);