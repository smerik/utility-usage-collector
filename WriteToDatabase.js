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
    electricity_actual_power: getElectricityActualPower(line),
    electricity_actual_switch_position: getElectricityActualSwitchPosition(line),
    electricity_actual_threshold: getElectricityActualThreshold(line),
    electricity_meter_reading: getElectricityMeterReadings(line),
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


function getElectricityActualPower(line) {
  return [
    [
      {
        value: line.channels[0].actualPowerDeliveredByClient.value,
        time: line.receivedAt
      },
      {
        equipmentId: line.channels[0].equipmentId,
        deliveryType: 'by_client'
      }
    ],
    [
      {
        value: line.channels[0].actualPowerDeliveredToClient.value,
        time: line.receivedAt
      },
      {
        equipmentId: line.channels[0].equipmentId,
        deliveryType: 'to_client'
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

function getElectricityMeterReadings(line) {
  return [
    [
      {
        value: line.channels[0].meterReadingDeliveredToClientNormalTariff.value,
        time: line.receivedAt
      },
      {
        equipmentId: line.channels[0].equipmentId,
        deliveryType: 'to_client',
        tariff: 'normal'
      }
    ],
    [
      {
        value: line.channels[0].meterReadingDeliveredToClientLowTariff.value,
        time: line.receivedAt
      },
      {
        equipmentId: line.channels[0].equipmentId,
        deliveryType: 'to_client',
        tariff: 'low'
      }
    ],
    [
      {
        value: line.channels[0].meterReadingDeliveredByClientNormalTariff.value,
        time: line.receivedAt
      },
      {
        equipmentId: line.channels[0].equipmentId,
        deliveryType: 'by_client',
        tariff: 'normal'
      }

    ],
    [
      {
        value: line.channels[0].meterReadingDeliveredByClientLowTariff.value,
        time: line.receivedAt
      },
      {
        equipmentId: line.channels[0].equipmentId,
        deliveryType: 'by_client',
        tariff: 'low'
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
        value: line.channels[1].lastHourlyMeterReading.value,
        time: line.channels[1].lastHourlyMeterReading.readAt
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
        value: line.channels[1].lastHourlyMeterReading.something1,
        time: line.channels[1].lastHourlyMeterReading.readAt
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
        value: line.channels[1].lastHourlyMeterReading.something2,
        time: line.channels[1].lastHourlyMeterReading.readAt
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
        value: line.channels[1].lastHourlyMeterReading.something3,
        time: line.channels[1].lastHourlyMeterReading.readAt
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
        time: line.channels[1].lastHourlyMeterReading.readAt
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
