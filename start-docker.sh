#!/bin/bash
cd /var/www/timer
/usr/bin/docker-compose up -d >> /var/log/timer-docker.log 2>&1
