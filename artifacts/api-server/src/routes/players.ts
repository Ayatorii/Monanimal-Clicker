import { Router, type IRouter } from "express";
import { db, playersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/players/:id", async (req, res) => {
  const [player] = await db
    .select()
    .from(playersTable)
    .where(eq(playersTable.id, req.params.id));

  if (!player) return res.status(404).json({ error: "not_found" });
  return res.json(player);
});

router.get("/players/recover/:code", async (req, res) => {
  const [player] = await db
    .select()
    .from(playersTable)
    .where(eq(playersTable.recoveryCode, req.params.code));

  if (!player) return res.status(404).json({ error: "not_found" });
  return res.json(player);
});

router.post("/players", async (req, res) => {
  const { id, recoveryCode, state } = req.body;

  const [player] = await db
    .insert(playersTable)
    .values({ id, recoveryCode, state })
    .onConflictDoUpdate({
      target: playersTable.id,
      set: { state, updatedAt: new Date() },
    })
    .returning();

  res.json(player);
});

export default router;
