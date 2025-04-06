import { Router } from "express";
import workspaceRoutes from "./workspace-routes";
import workspaceTimerRoutes from "./workspace-timer-routes";
import bankToNotionRoutes from "./bank-to-notion-routes";

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

router.use("/workspace-timer", workspaceTimerRoutes);

router.use("/bank-to-notion", bankToNotionRoutes);

export default router;
