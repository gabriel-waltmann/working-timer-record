import { Router } from "express";
import workspaceRoutes from "./workspace-routes";
import workspaceTimerController from "./workspace-timer-routes";
const router = Router();

/**
 * @openapi
 * /:
 *  get:
 *    tags: [Core]
 *    summary: Check if API is running
 *    description: Check if API is running
 *    responses:
 *      200:
 *        description: API is running
 */
router.get("/", (req, res) => {
  res.status(200).json({ message: "API is running!" });
});

router.use("/workspaces", workspaceRoutes);
router.use("/workspace-timer", workspaceTimerController);

export default router;
