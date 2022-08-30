import express, { Router } from 'express';
import * as controller from '../controllers/global';

const router: Router = express.Router();

router.use(express.static('public'));
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

// router.get('/create', controller.createGame);

export default router;