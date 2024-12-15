# Waves Timer
Web app that uses a database for a stopwatch that many people can use at the same time if connected to that server.

The database is queried with javascript every 100ms but relies on the database's time in order for everyone to be on track 
*(or at least withint 100ms of one another (which is good enough for the original purpose of this))*

change the db credentials towards the top of the file timecheck.php for your specific system.

Timer viewers will use the base URL, controllers of the timer will use mydomain.com/control

# installation
Install LAMP stack, run migration for sql file, adjust mysql credentials as appropriate.

# Added 2024
+ count down and up
+ react timer entry
+ QR sharing
+ Get Ready button
  
# Added 2023
+ Dark mode
+ new style sheet
+ Control page (/control.html)

### future:
+ multiple timers
+ show number of people connected



