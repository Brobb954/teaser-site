package initialization

import (
	"os"
)

type Config struct {
	DBHost         string
	DBPort         string
	DBUser         string
	DBPassword     string
	DBName         string
	ServerPort     string
	AllowedOrigins string
}

func getEnvOrDefault(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}

	return value
}

func GetConfig() Config {
	return Config{
		DBHost:         getEnvOrDefault("DB_HOST", "postgres"),
		DBPort:         getEnvOrDefault("DB_PORT", "5432"),
		DBUser:         getEnvOrDefault("DB_USER", "postgres"),
		DBName:         getEnvOrDefault("DB_NAME", "postgres"),
		DBPassword:     getEnvOrDefault("DB_PASSWORD", ""),
		ServerPort:     getEnvOrDefault("SERVER_PORT", "8000"),
		AllowedOrigins: getEnvOrDefault("ALLOWED_ORIGINS", "*"),
	}
}
