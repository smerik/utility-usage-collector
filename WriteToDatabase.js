/*
Utility Usage Monitor - A utility usage monitoring application.
Copyright (C) 2015  Erik van der Kolk

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
module.exports = WriteToDatabase;

var Transform = require('stream').Transform;
var util = require('util');
util.inherits(WriteToDatabase, Transform);

var _ = require('lodash');

var influx = require('influx');
var client = influx({
  host: 'localhost',
  database: 'utility_usage_db'
});

function WriteToDatabase () {
  util.log('WriteToDatabase');
  Transform.call(this, { 'objectMode': true });
}

WriteToDatabase.prototype._transform = function (line, encoding, done) {
  var series = {};

  var electricitySeries = getElectricitySeries(line);
  var gasSeries = getGasSeries(line)
  _.merge(series, electricitySeries, gasSeries);

  client.writeSeries(series, finishedWrite);

  this.push(line);
  done();
};

function getElectricitySeries(line) {
  var timestamp = line.receivedAt;

  return {
    electricity_actual_power_delivered_by_client: getMeasurementByValue('actualPowerDeliveredByClient', timestamp, line, 0),
    electricity_actual_power_delivered_to_client: getMeasurementByValue('actualPowerDeliveredToClient', timestamp, line, 0),
    electricity_actual_switch_position: getMeasurement('actualSwitchPosition', timestamp, line, 0),
    electricity_actual_threshold: getMeasurementByValue('actualThreshold', timestamp, line, 0),
    electricity_meter_reading_delivered_by_client_low_tariff: getMeasurementByValue('meterReadingDeliveredByClientLowTariff', timestamp, line, 0),
    electricity_meter_reading_delivered_by_client_normal_tariff: getMeasurementByValue('meterReadingDeliveredByClientNormalTariff', timestamp, line, 0),
    electricity_meter_reading_delivered_to_client_low_tariff: getMeasurementByValue('meterReadingDeliveredToClientLowTariff', timestamp, line, 0),
    electricity_meter_reading_delivered_to_client_normal_tariff: getMeasurementByValue('meterReadingDeliveredToClientNormalTariff', timestamp, line, 0),
    electricity_tariff_indicator: getMeasurement('tariffIndicator', timestamp, line, 0),
    electricity_text_message: getElectricityTextMessage(timestamp, line, 0)
  };
}

function getGasSeries(line) {
  var timestamp = line.channels[1].readAt;

  return {
    gas_meter_reading: getMeasurementByValue('meterReadingDeliveredToClient', timestamp, line, 1),
    gas_unknown_data_1: getMeasurement('unknownData1', timestamp, line, 1),
    gas_unknown_data_2: getMeasurement('unknownData2', timestamp, line, 1),
    gas_unknown_data_3: getMeasurement('unknownData3', timestamp, line, 1),
    gas_valve_position: getMeasurement('valvePosition', timestamp, line, 1)
  };
}

function getMeasurementByValue(measurement, timestamp, line, channelNr) {
  return [
    [
      {
        value: line.channels[channelNr][measurement].value,
        time: timestamp
      },
      {
        equipmentId: line.channels[channelNr].equipmentId
      }
    ]
  ];
}

function getMeasurement(measurement, timestamp, line, channelNr) {
  return [
    [
      {
        value: line.channels[channelNr][measurement],
        time: timestamp
      },
      {
        equipmentId: line.channels[channelNr].equipmentId
      }
    ]
  ]
}

function getElectricityTextMessage(timestamp, line, channelNr) {
  var result = getMeasurement('textMessage', timestamp, line, channelNr);
  result[0][0].code = line.channels[channelNr].textMessageCodes;

  return result;
}

function finishedWrite(error, response) {
  util.log('error', error);
  util.log('response', response);
}
