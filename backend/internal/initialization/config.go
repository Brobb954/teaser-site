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
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultValue
}

func GetConfig() Config {
	return Config{
		DBHost:         getEnvOrDefault("DB_HOST", "localhost"),
		DBPort:         getEnvOrDefault("DB_PORT", "5432"),
		DBUser:         getEnvOrDefault("DB_USER", "postgres"),
		DBName:         getEnvOrDefault("DB_NAME", "postgres"),
		DBPassword:     getEnvOrDefault("DB_PASSWORD", "notPassword"),
		ServerPort:     getEnvOrDefault("SERVER_PORT", "8000"),
		AllowedOrigins: getEnvOrDefault("ALLOWED_ORIGINS", "*"),
	}
}
