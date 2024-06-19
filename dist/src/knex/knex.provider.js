"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.knexProvider = exports.KNEX_CONNECTION = void 0;
const Knex = require("knex");
const knexfile_1 = require("../../knexfile");
const config_1 = require("@nestjs/config");
exports.KNEX_CONNECTION = 'KNEX_CONNECTION';
exports.knexProvider = {
    provide: exports.KNEX_CONNECTION,
    inject: [config_1.ConfigService],
    useFactory: async (configService) => {
        const nodeEnv = configService.get('NODE_ENV') || 'development';
        let knexConfig;
        if (nodeEnv === 'production') {
            knexConfig = knexfile_1.default.production;
        }
        else {
            knexConfig = knexfile_1.default.development;
        }
        const knex = Knex(knexConfig);
        return knex;
    },
};
//# sourceMappingURL=knex.provider.js.map