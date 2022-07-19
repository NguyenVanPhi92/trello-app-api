import express from "express";
import { boardRoutes } from "./board.route";
import { columnRoutes } from "./column.route";
import { cardRoutes } from "./card.route";

const router = express.Router();

/**
 * Boards API
 */
router.use("/boards", boardRoutes);

/**
 * Columns API
 */
router.use("/columns", columnRoutes);

/**
 * Cards API
 */
router.use("/cards", cardRoutes);

export const apiV1 = router;
