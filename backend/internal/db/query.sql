-- name: GetMarket :one
SELECT
  pm.marketId,
  pm.title,
  pm.volume,
  pm.description
FROM
  predictionMarket pm
WHERE
  pm.marketId = $1;

-- name: GetOptions :many
SELECT
  po.optionId,
  po.marketId,
  po.optionText,
  po.optionCount
FROM
  predictionOptions po
WHERE
  po.marketId = $1;

-- name: IncrementCount :execrows
UPDATE predictionOptions
  set optionCount = optionCount + 1
WHERE
  optionId = $1;

-- name: IncrementVolume :execrows
UPDATE predictionMarket
  set volume = volume + 1
WHERE
  marketId = $1;
