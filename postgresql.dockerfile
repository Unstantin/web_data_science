# Используем официальный образ PostgreSQL
FROM postgres:13

# Устанавливаем переменные окружения
ENV POSTGRES_DB=science
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres

# Открываем порт для подключения к базе данных
EXPOSE 5432