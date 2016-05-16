/*
Utility Usage Collector - A utility usage data collecting application.
Copyright (C) 2015-2016  Erik van der Kolk

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
var util = require('util'),
  split = require('split2'),
  P1Telegram = require('./P1Telegram'),
  FormatToJson = require('./FormatToJson'),
  WriteToDatabase = require('./WriteToDatabase'),
  SerialPort = require('serialport').SerialPort, // localize object constructor
  serialPath = process.argv[2] || '/dev/ttyUSB0';

var sp = new SerialPort(serialPath, {
  databits: 7,
  parity: 'even'
}, false);

sp.on('error', function (cb) {
  util.log('error event');
  util.log(cb);
}).on('close', function (cb) {
  util.log('close');
});

sp.open(function (error) {
  if (error) {
    util.log('error:', error);
  } else {
    util.log('open');

    sp
      .pipe(split('\r\n'))
      .pipe(new P1Telegram())
      .pipe(new WriteToDatabase())
      .pipe(new FormatToJson())
      .pipe(process.stdout)
    ;
  }
});


process.on('SIGINT', function () {
  sp.close(function (error) {
    util.log('closing');
    if (error) {
      util.log('error', error);
    }
  });
});
