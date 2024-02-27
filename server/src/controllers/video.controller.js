import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideo = asyncHandler(async (req, res) => {
  // const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  const videos = await Video.aggregate([
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
    {
      $project: {
        "ownerDetails.password": 0,
        "ownerDetails.bio": 0,
        "ownerDetails.watchHistory": 0,
        "ownerDetails.dob": 0,
        "ownerDetails.refreshToken": 0,
        "ownerDetails.coverImage": 0,
      },
    },
  ]).limit(10);
  res
    .status(200)
    .json(new ApiResponse(200, videos, "Videos fetched Successfully"));
});

const getAllVideosOfUser = asyncHandler(async (req, res) => {
  // const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  const { userId } = req.params;
  const videos = await Video.find({ owner: userId });
  res
    .status(200)
    .json(new ApiResponse(200, videos, "Videos fetched Successfully"));
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  // TODO: get video, upload to cloudinary, create video
  const videoLocalPath = req.files?.video[0]?.path;
  let thumbnailLocalPath;
  if (Array.isArray(req.files.thumbnail) && req.files.thumbnail.length > 0) {
    thumbnailLocalPath = req.files.thumbnail[0].path;
  }
  if (!videoLocalPath) {
    throw new ApiError(400, "video file is required");
  }
  const video = await uploadOnCloudinary(videoLocalPath);
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
  if (!video) {
    throw new ApiError(400, "video file is required");
  }
  const uploadObject = await Video.create({
    title,
    description,
    views: 0,
    isPublished: true,
    duration: video.duration,
    owner: req.user?._id,
    "video.url": video.url,
    "video.publicId": video.public_id,
    "thumbnail.url": thumbnail?.url || "",
    "thumbnail.publicId": thumbnail?.public_id || "",
  });
  if (!uploadObject) {
    throw new ApiError(500, "Something went wrong while Uploading images");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Video Uploaded Successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Video Id is not Correct");
  }
  const video = await Video.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(videoId),
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
      $lookup: {
        from: "subscriptions",
        localField: "ownerDetails._id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "ownerDetails._id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "video",
        as: "likedBy",
      },
    },
    {
      $addFields: {
        subscribersCount: {
          $size: "$subscribers",
        },
        channelsSubscribedToCount: {
          $size: "$subscribedTo",
        },
        noOfLikes: {
          $size: "$likedBy",
        },
        isLiked: {
          $cond: {
            if: {
              $in: [
                new mongoose.Types.ObjectId(req?.user._id),
                "$likedBy.likedBy",
              ],
            },
            then: true,
            else: false,
          },
        },
        isSubscribed: {
          $cond: {
            if: {
              $in: [
                new mongoose.Types.ObjectId(req?.user._id),
                "$subscribers.subscriber",
              ],
            },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $unwind: "$ownerDetails",
    },
    {
      $project: {
        subscribers: 0,
        subscribedTo: 0,
        "likedBy.video": 0,
        "likedBy.createdAt": 0,
        "likedBy.updatedAt": 0,
      },
    },
  ]);
  if (!video) {
    throw new ApiError(400, "Something Went Wrong While Fetching video");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, video[0], "Video Fetched Succesfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: update video details like title, description, thumbnail
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Video Id is Not valid");
  }
  const deletedVideo = await Video.findByIdAndDelete(videoId);
  if (!deletedVideo) {
    throw new ApiError(400, "Something Went Wrong While Deleting Video");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, deletedVideo, "Video Deleted Successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
});

export {
  getAllVideo,
  getAllVideosOfUser,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
