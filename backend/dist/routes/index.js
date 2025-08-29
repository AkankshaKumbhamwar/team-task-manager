"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../controller/auth");
const tasks_1 = require("../controller/tasks");
const project_1 = require("../controller/project");
exports.routes = (0, express_1.default)();
exports.routes.use("/api/auth", auth_1.authRouter);
exports.routes.use('/api/projects', project_1.projectRoutes);
exports.routes.use('/api/tasks', tasks_1.taskRoutes);
//# sourceMappingURL=index.js.map