"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = express_1.Router();
//===============================================
//                  ROUTES
//===============================================
router.use(require('./router.routes'));
router.use(require('./user.routes'));
//===============================================
//                  EXPORTS
//===============================================
exports.default = router;
