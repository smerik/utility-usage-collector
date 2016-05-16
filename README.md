# Utility Usage Collector
A service application for collecting utility usage data.

[![GitHub license][license-img]][license-url]

[![GitHub issues][github-issues-img]][github-issues-url]
[![GitHub forks][github-forks-img]][github-forks-url]
[![GitHub stars][github-stars-img]][github-stars-url]

[![npm version][npm-version-img]][npm-version-url]
[![Dependency Status][npm-dependencies-img]][npm-dependencies-url]
[![devDependency Status][npm-dev-dependencies-img]][npm-dev-dependencies-url]

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

[github-issues-img]: https://img.shields.io/github/issues/smerik/utility-usage-collector.svg?style=flat-square
[github-issues-url]: https://github.com/smerik/utility-usage-collector/issues
[github-forks-img]: https://img.shields.io/github/forks/smerik/utility-usage-collector.svg?style=flat-square
[github-forks-url]: https://github.com/smerik/utility-usage-collector/network
[github-stars-img]: https://img.shields.io/github/stars/smerik/utility-usage-collector.svg?style=flat-square
[github-stars-url]: https://github.com/smerik/utility-usage-collector/stargazers
[license-img]: https://img.shields.io/badge/license-GPLv2-blue.svg?style=flat-square
[license-url]: https://raw.githubusercontent.com/smerik/utility-usage-collector/master/LICENSE
[npm-dependencies-img]: https://david-dm.org/smerik/utility-usage-collector.svg?style=flat-square
[npm-dependencies-url]: https://david-dm.org/smerik/utility-usage-collector
[npm-dev-dependencies-img]: https://david-dm.org/smerik/utility-usage-collector/dev-status.svg?style=flat-square
[npm-dev-dependencies-url]: https://david-dm.org/smerik/utility-usage-collector#info=devDependencies
[npm-version-img]: https://img.shields.io/npm/v/utility-usage-collector.svg?style=flat-square
[npm-version-url]: https://www.npmjs.com/package/utility-usage-collector
