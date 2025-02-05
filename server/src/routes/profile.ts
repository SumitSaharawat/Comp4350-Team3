/*
 * GET user profile page.
 */
import express from 'express';


const router = express.Router();
// just a test message for now
router.get('/', (req: express.Request, res: express.Response) => {
    res.send("responded with a resource");
});

export default router;