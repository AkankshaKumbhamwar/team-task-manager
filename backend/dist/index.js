"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./models/db"));
const routes_1 = require("./routes");
const envConfig_1 = require("./utils/envConfig");
dotenv_1.default.config();
const app = (0, express_1.default)();
(0, db_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(routes_1.routes);
app.listen(envConfig_1.PORT || 5000, () => console.log(`Server running on port ${envConfig_1.PORT}`));
//# sourceMappingURL=index.js.map