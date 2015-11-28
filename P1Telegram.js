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
module.exports = P1Telegram;

var util = require('util'),
    Transform = require('stream').Transform,
    moment = require('moment');

util.inherits(P1Telegram, Transform);

function P1Telegram () {
  util.log('P1Telegram');
  Transform.call(this, { 'objectMode': true });

  this.telegram = null;
  this.transformAllowed = false;
}


P1Telegram.prototype._transform = function (line, encoding, done) {
  var regexForObis = /^\d-\d{1,2}:\d{1,2}\.\d{1,2}\.\d{1,3}/g,
    regexForCosem = /\((.*?)\)/g;

  if (this.transformAllowed) {
    if (line[0] === '!') {
      this.transformAllowed = false;
      this.push(this.telegram);
    } else {
      var obis = regexForObis.exec(line),
        cosem = line.substring(regexForObis.lastIndex, line.length),
        cosemValues = cosem.split(regexForCosem);

      if (obis) {
        var groups = obis[0].split(/\.|:|-/),
          medium = +groups[0],
          channel = +groups[1],
          physicalValue = +groups[2],
          algorithm = +groups[3],
          measurementType = +groups[4],

          key = obis[0].split(':')[1];

        var channelData = this.telegram.channels[channel] || {};
        // TODO: why did I wrote this medium check?
        if (medium === 0) {
          switch (key) {
            case '17.0.0':
              channelData.actualThreshold = parseCosem(cosemValues[1]);
              break;
            case '24.1.0':
              // TODO: 3 = gas???
              // Unsigned:F3(0,0)
              channelData.deviceType = +cosemValues[1];
              break;
            case '24.3.0':
              channelData.readAtHumanLocal = moment(cosemValues[1], 'YYMMDDHHmmss').format();
              channelData.readAt = moment(cosemValues[1], 'YYMMDDHHmmss').valueOf();
              channelData.unknownData1 = cosemValues[3];
              channelData.unknownData2 = cosemValues[5];
              channelData.unknownData3 = cosemValues[7];
              channelData.obisX = cosemValues[9];
              channelData.meterReadingDeliveredToClient = { unit: cosemValues[11] };
              break;
            case '24.4.0':
              channelData.valvePosition = +cosemValues[1];
              break;
            case '96.1.0':
            // fall through
            case '96.1.1':
              channelData.equipmentId = new Buffer(cosemValues[1], 'hex').toString();
              break;
            case '96.3.10':
              // Actual switch position Electricity (in/out/enabled)
              channelData.actualSwitchPosition = +cosemValues[1];
              break;
            case '96.13.0':
              // max 1024 characters, Sn (n=0..2048)
              channelData.textMessage = new Buffer(cosemValues[1], 'hex').toString();
              break;
            case '96.13.1':
              // numeric: 8 digits, Sn (n=0..32)
              channelData.textMessageCodes = new Buffer(cosemValues[1], 'hex').toString();
              break;
            case '96.14.0':
              // TODO: check if this the correct way of parsing an octet string?
              // octet string, Sn (n=4)
              channelData.tariffIndicator = new Buffer(cosemValues[1]).toString();
              break;
            default:
              util.log('unknown obis id:', obis);
              channelData[key] = cosem;
          }
        } else {
          switch (key) {
            case '1.7.0':
              channelData.actualPowerDeliveredToClient = parseCosem(cosemValues[1]);
              break;
            case '1.8.1':
              channelData.meterReadingDeliveredToClientNormalTariff = parseCosem(cosemValues[1]);
              break;
            case '1.8.2':
              channelData.meterReadingDeliveredToClientLowTariff = parseCosem(cosemValues[1]);
              break;
            case '2.7.0':
              channelData.actualPowerDeliveredByClient = parseCosem(cosemValues[1]);
              break;
            case '2.8.1':
              channelData.meterReadingDeliveredByClientNormalTariff = parseCosem(cosemValues[1]);
              break;
            case '2.8.2':
              channelData.meterReadingDeliveredByClientLowTariff = parseCosem(cosemValues[1]);
              break;
            default:
              util.log('unknown obis id:', obis);
              channelData[key] = cosem;
          }
        }
        this.telegram.channels[channel] = channelData;
      } else if (cosem) {
        this.telegram.channels[1].meterReadingDeliveredToClient.value = +cosemValues[1];
      }

      util.log('obis: %s, cosem: %s, cvalues: %s', obis, cosem, cosemValues);
    }
  } else {
    if (line[0] === '/') {
      this.transformAllowed = true;
      this.telegram = {
        receivedAt: moment().valueOf(),
        // manufacturer ids
        // ISk = 'Iskra'
        // KFM = 'Kaifa'
        // KMP = 'Kamstrup'
        // XMX = 'Landis + Gyr'
        manufacturerId: line.substring(1, 4),
        id: line.substring(5, line.length),
        channels: {}
      };
    } else {
      console.warn('Unexpected line. Ignoring:', line);
    }
  }
  done();
};

function parseCosem(cosemValue) {
  var cosemAttributes = cosemValue.split('*');
  return {
    value: +cosemAttributes[0],
    unit: cosemAttributes[1]
  };
}
