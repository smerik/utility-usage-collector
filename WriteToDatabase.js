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
  var series = {
    electricity_actual_power_delivered_by_client: getElectricityActualPowerDeliveredByClient(line),
    electricity_actual_power_delivered_to_client: getElectricityActualPowerDeliveredToClient(line),
    electricity_actual_switch_position: getElectricityActualSwitchPosition(line),
    electricity_actual_threshold: getElectricityActualThreshold(line),
    electricity_meter_reading_delivered_by_client_low_tariff: getElectricityMeterReadingsDeliveredByClientLowTariff(line),
    electricity_meter_reading_delivered_by_client_normal_tariff: getElectricityMeterReadingsDeliveredByClientNormalTariff(line),
    electricity_meter_reading_delivered_to_client_low_tariff: getElectricityMeterReadingsDeliveredToClientNormalTariff(line),
    electricity_meter_reading_delivered_to_client_normal_tariff: getElectricityMeterReadingsDeliveredToClientLowTariff(line),
    electricity_tariff_indicator: getElectricityTariffIndicator(line),
    electricity_text_message: getElectricityTextMessage(line),
    gas_meter_reading: getGasMeterReading(line),
    gas_unknown_data_1: getGasUnknownData1(line),
    gas_unknown_data_2: getGasUnknownData2(line),
    gas_unknown_data_3: getGasUnknownData3(line),
    gas_valve_position: getGasValvePosition(line)
  };

  client.writeSeries(series, finishedWrite);

  this.push(line);
  done();
};


function getElectricityActualPowerDeliveredByClient(line) {
  return [
    [
      {
        value: line.channels[0].actualPowerDeliveredByClient.value,
        time: line.receivedAt
      },
      {
        equipmentId: line.channels[0].equipmentId
      }
    ]
  ];
}

function getElectricityActualPowerDeliveredToClient(line) {
  return [
    [
      {
        value: line.channels[0].actualPowerDeliveredToClient.value,
        time: line.receivedAt
      },
      {
        equipmentId: line.channels[0].equipmentId
      }
    ]
  ];
}

function getElectricityActualSwitchPosition(line) {
  return [
    [
      {
        value: line.channels[0].actualSwitchPosition,
        time: line.receivedAt
      },
      {
        equipmentId: line.channels[0].equipmentId
      }
    ]
  ];
}

function getElectricityActualThreshold(line) {
  return [
    [
      {
        value: line.channels[0].actualThreshold.value,
        time: line.receivedAt
      },
      {
        equipmentId: line.channels[0].equipmentId
      }
    ]
  ];
}

function getElectricityMeterReadingsDeliveredToClientNormalTariff(line) {
  return [
    [
      {
        value: line.channels[0].meterReadingDeliveredToClientNormalTariff.value,
        time: line.receivedAt
      },
      {
        equipmentId: line.channels[0].equipmentId
      }
    ]
  ];
}

function getElectricityMeterReadingsDeliveredToClientLowTariff(line) {
    return [
      [
        {
          value: line.channels[0].meterReadingDeliveredToClientLowTariff.value,
          time: line.receivedAt
        },
        {
          equipmentId: line.channels[0].equipmentId
        }
      ]
    ];
}

function getElectricityMeterReadingsDeliveredByClientNormalTariff(line) {
  return [
    [
      {
        value: line.channels[0].meterReadingDeliveredByClientNormalTariff.value,
        time: line.receivedAt
      },
      {
        equipmentId: line.channels[0].equipmentId
      }
    ]
  ];
}

function getElectricityMeterReadingsDeliveredByClientLowTariff(line) {
  return [
    [
      {
        value: line.channels[0].meterReadingDeliveredByClientLowTariff.value,
        time: line.receivedAt
      },
      {
        equipmentId: line.channels[0].equipmentId
      }
    ]
  ];
}

function getElectricityTariffIndicator(line) {
  return [
    [
      {
        value: line.channels[0].tariffIndicator,
        time: line.receivedAt
      },
      {
        equipmentId: line.channels[0].equipmentId
      }
    ]
  ];
}

function getElectricityTextMessage(line) {
  return [
    [
      {
        value: line.channels[0].textMessage,
        code: line.channels[0].textMessageCodes,
        time: line.receivedAt
      },
      {
        equipmentId: line.channels[0].equipmentId
      }
    ]
  ];
}

function getGasMeterReading(line) {
  return [
    [
      {
        value: line.channels[1].meterReadingDeliveredToClient.value,
        time: line.channels[1].readAt
      },
      {
        equipmentId: line.channels[1].equipmentId
      }
    ]
  ];
}

function getGasUnknownData1(line) {
  return [
    [
      {
        value: line.channels[1].unknownData1,
        time: line.channels[1].readAt
      },
      {
        equipmentId: line.channels[1].equipmentId
      }
    ]
  ];
}

function getGasUnknownData2(line) {
  return [
    [
      {
        value: line.channels[1].unknownData2,
        time: line.channels[1].readAt
      },
      {
        equipmentId: line.channels[1].equipmentId
      }
    ]
  ];
}

function getGasUnknownData3(line) {
  return [
    [
      {
        value: line.channels[1].unknownData3,
        time: line.channels[1].readAt
      },
      {
        equipmentId: line.channels[1].equipmentId
      }
    ]
  ];
}

function getGasValvePosition(line) {
  return [
    [
      {
        value: line.channels[1].valvePosition,
        time: line.channels[1].readAt
      },
      {
        equipmentId: line.channels[1].equipmentId
      }
    ]
  ];
}

function finishedWrite(error, response) {
  util.log('error', error);
  util.log('response', response);
}
