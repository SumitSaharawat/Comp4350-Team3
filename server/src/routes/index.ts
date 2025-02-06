/*
 * GET home page.
 */
import express from 'express';
const router = express.Router();

router.get('/', (req: express.Request, res: express.Response) => {
    console.log(`body: ${req.body}`);
    res.json({ test: "This is a test" });
});


router.post('/', (req: express.Request, res: express.Response) => {
    res.json({ test: "This is a test" });
});

export default router;