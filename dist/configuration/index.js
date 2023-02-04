"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.soccerConfig = exports.matchConfig = exports.schedulerConfig = exports.generalConfig = void 0;
exports.generalConfig = {
    dbUrl: process.env.DB_URL || 'mongodb://127.0.0.1:27017/Champ',
    defaultPageNumber: 1,
    defaultPageSize: 100,
};
exports.schedulerConfig = {
    processEvery: '2 seconds',
    priority: 'normal',
};
exports.matchConfig = {
    dayToUpdate: 7,
};
exports.soccerConfig = {
    leaguesIds: ['673'],
    defaultNextFutureMatchesAmount: 10,
};
//# sourceMappingURL=index.js.map