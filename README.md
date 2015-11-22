# Utility Usage Monitor
An application for logging and monitoring the utility usage.

## Work in progress
At this moment the application is only able to log the received data to a database.
The measurements schema will probably change in a short term.

The frontend for showing the statistics will be implemented later.

### Database
The application makes use of InfluxDB for storing the received data.
The required database version is at least `v0.9`.

Please note that the connection config is still hard coded:
- Host is `localhost`
- Default port is used: `8086`
- Default protocol is used: `http`
- Database is named `utility_usage_db` & should be created manually
- No credentials are used
