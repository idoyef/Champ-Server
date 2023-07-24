export enum SoccerFixtureStatusLong {
  FIRST_HALF = 'First Half',
  BREAK = 'Break',
  SECOND_HALF = 'Second Half',
}

export enum SoccerFixtureStatusShort {
  NS = 'NS',
  '1H' = '1H',
  HT = 'HT', // Halftime - Finished in the regular time
  '2H' = '2H',
  FT = 'FT', //Match Finished	- Finished in the regular time
  AET = 'AET', // Match Finished - Finished after extra time without going to the penalty shootout
  PEN = 'PEN', // Match Finished	- Finished after the penalty shootout
}
