"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = express_1.Router();
//===============================================
//                  RUTAS
//===============================================
router.get('/usuarios', (req, res) => {
    res.json({
        ok: true,
        mensaje: 'usuarios'
    });
});
//===============================================
//                  EXPORTS
//===============================================
exports.default = router;
