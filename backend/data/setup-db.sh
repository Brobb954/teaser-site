#!/bin/bash

DB=data/solmarket.db

goose sqlite3 -dir data/migrations data/solmarket.db up

INSERT_STATMENTS=(
  "INSERT INTO predictionOptions VALUES(1,0,'3 to 6 Weeks',0);"
  "INSERT INTO predictionOptions VALUES(2,0,'2 to 6 Months',0);"
  "INSERT INTO predictionOptions VALUES(3,0,'Never',0);"
  "INSERT INTO predictionOptions VALUES(0,0, '1 to 2 Weeks', 0);"
  "INSERT INTO predictionMarket VALUES(0, 'Countdown to Launch: Make Your', 'Prediction' , 0, null, 'Help us kickstart our journey! Guess when our site will launch and be part of our story from the beginning.');"
)

for STATEMENT in "${INSERT_STATMENTS[@]}"; do
  sqlite3 "$DB" "$STATEMENT"
  if [[$? -ne 0 ]]; then
    echo "Failed to execute: $STATEMENT"
    exit 1
  else
    echo "Success: $STATEMENT"
  fi
done

echo "All Done"
