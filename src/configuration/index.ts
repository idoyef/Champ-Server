export const generalConfig = {
  dbUrl: process.env.DB_URL || 'mongodb://127.0.0.1:27017/Champ',
  defaultPageNumber: 1,
  defaultPageSize: 100,
};

export const schedulerConfig = {
  processEvery: '2 seconds',
  priority: 'normal',
};

export const matchConfig = {
  dayToUpdate: 7,
};

export const soccerConfig = {
  leaguesIds: ['673'],
  defaultNextFutureMatchesAmount: 10,
};
