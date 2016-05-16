# Utility Usage Collector
A service application for collecting utility usage data.

[![GitHub license](https://img.shields.io/badge/license-GPLv2-blue.svg?style=flat-square)](https://raw.githubusercontent.com/smerik/utility-usage-collector/master/LICENSE)

[![GitHub issues](https://img.shields.io/github/issues/smerik/utility-usage-collector.svg?style=flat-square)](https://github.com/smerik/utility-usage-collector/issues)
[![GitHub forks](https://img.shields.io/github/forks/smerik/utility-usage-collector.svg?style=flat-square)](https://github.com/smerik/utility-usage-collector/network)
[![GitHub stars](https://img.shields.io/github/stars/smerik/utility-usage-collector.svg?style=flat-square)](https://github.com/smerik/utility-usage-collector/stargazers)

## Work in progress
At this moment the application is working properly with the DSMR2.2+ generation of the Landis+Gyr E350 meter.
Support for other DSMR versions and meters will follow some day.

### Database
The application makes use of InfluxDB for storing the received data.
The required database version is at least `v0.9`.

Please note that the connection config is still hard coded:
- Host is `localhost`
- Default port is used: `8086`
- Default protocol is used: `http`
- Database is named `utility_usage_db` & should be created manually
- No credentials are used
