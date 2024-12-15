FROM php:7.4-apache

# Install system dependencies
RUN apt-get update && apt-get install -y \
    default-mysql-client \
    libpng-dev \
    && rm -rf /var/lib/apt/lists/*

# Configure Apache
RUN a2enmod rewrite

# Install PHP extensions
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Set working directory
WORKDIR /var/www/html

# Copy application files
COPY src/ /var/www/html/

# Set permissions
RUN chown -R www-data:www-data /var/www/html

RUN echo "display_errors = Off" >> /usr/local/etc/php/php.ini
RUN echo "log_errors = On" >> /usr/local/etc/php/php.ini
