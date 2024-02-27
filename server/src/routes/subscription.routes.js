import { Router } from "express";
import {
  getSubscribedChannels,
  getUserChannelSubscribers,
  getUserIsSubscribed,
  toggleSubscription,
} from "../controllers/subscription.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router
  .route("/subscribe/:channelId")
  .get(getUserChannelSubscribers)
  .post(toggleSubscription);

router.route("/subscribed/:channelId").get(getUserIsSubscribed);

router.route("/subscribedChannel").get(getSubscribedChannels);

export default router;
