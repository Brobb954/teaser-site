CREATE TABLE predictionMarket (
  marketId serial PRIMARY KEY,
  title text not null,
  volume integer not null,
  description text not null
);


CREATE TABLE predictionOptions (
  optionId serial PRIMARY KEY,
  marketId integer not null,
  optionText text not null,
  optionCount integer not null,
  FOREIGN KEY(marketId) REFERENCES predictionMarket(marketId) ON DELETE CASCADE
);

INSERT INTO predictionMarket (title, volume, description) VALUES(
  'Countdown to Launch: Make Your Prediction',
  0,
  'Help us kickstart our journey! Guess when our site will launch and be part of our story from the beginning.'
  );

INSERT INTO predictionOptions (marketId, optionText, optionCount) VALUES(1, '1 to 2 Weeks', 0);
INSERT INTO predictionOptions (marketId, optionText, optionCount) VALUES(1, '3 to 6 Weeks',0);
INSERT INTO predictionOptions (marketId, optionText, optionCount) VALUES(1, '2 to 6 Months',0);
INSERT INTO predictionOptions (marketId, optionText, optionCount) VALUES(1, 'Never',0);
---- create above / drop below ----

DROP TABLE predictionOptions;
DROP TABLE predictionMarket;
