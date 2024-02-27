import { Router } from "express";
import {
  deleteVideo,
  getAllVideo,
  getAllVideosOfUser,
  getVideoById,
  publishAVideo,
  togglePublishStatus,
  updateVideo,
} from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router(); // Apply verifyJWT middleware to all routes in this file

router.route("/uploadVideo").post(
  upload.fields([
    {
      name: "video",
      maxCount: 1,
    },
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  verifyJWT,
  publishAVideo
);

router.route("/getvideo/:userId").get(getAllVideosOfUser);

router.route("/getallvideo").get(getAllVideo);

router
  .route("/:videoId")
  .get(verifyJWT, getVideoById)
  .delete(deleteVideo)
  .patch(upload.single("thumbnail"), updateVideo, verifyJWT);

router.route("/toggle/publish/:videoId").patch(togglePublishStatus, verifyJWT);

export default router;
