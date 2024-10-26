-- +goose Up
-- +goose StatementBegin
CREATE TABLE predictionMarket (
  marketId INTEGER PRIMARY KEY,
  title VARCHAR(255),
  volume INTEGER not null,
  endDate DATE,
  description TEXT not null
);


CREATE TABLE predictionOptions (
  optionId INTEGER PRIMARY KEY,
  marketId INTEGER not null,
  optionText VARCHAR(255) not null,
  optionCount INTEGER not null,
  FOREIGN KEY(marketId) REFERENCES prediction_market(marketId) ON DELETE CASCADE
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
-- +goose StatementEnd
