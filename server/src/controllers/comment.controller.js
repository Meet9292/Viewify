import mongoose, { isValidObjectId } from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Video Id Is incorrect");
  }
  //   const { page = 1, limit = 10 } = req.query;
  const getComments = await Comment.aggregate([
    {
      $match: {
        video: new mongoose.Types.ObjectId(videoId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "ownerDetails",
      },
    },
    {
      $unwind: "$ownerDetails",
    },
  ]);
  if (!getComments) {
    throw new ApiError(400, "Something Went Wrong While Fetching Comment");
  }
  res
    .status(200)
    .json(new ApiResponse(200, getComments, "Fetched Successfully"));
});

const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video
  const { content } = req.body;
  const { videoId } = req.params;
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Not a Valid ObjectID ");
  }
  const comment = await Comment.create({
    content,
    video: videoId,
    owner: req.user._id,
  });
  if (!comment) {
    throw new ApiError(400, "Something Went Wrong while Commenting");
  }
  res.status(200).json(new ApiResponse(200, {}, "Comment Done"));
});

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
});

export { getVideoComments, addComment, updateComment, deleteComment };
