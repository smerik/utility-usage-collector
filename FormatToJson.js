/*
Utility Usage Collector - A utility usage data collecting application.
Copyright (C) 2015-2016  Erik van der Kolk

This file is part of Utility Usage Collector.

Utility Usage Collector is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 2 of the License, or
(at your option) any later version.

Utility Usage Collector is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with Utility Usage Collector.  If not, see <http://www.gnu.org/licenses/>.
*/
module.exports = FormatToJson;

var util = require('util');
var Transform = require('stream').Transform;

util.inherits(FormatToJson, Transform);

function FormatToJson () {
  util.log('FormatToJson');
  Transform.call(this, { 'objectMode': true });
}

FormatToJson.prototype._transform = function (line, encoding, done) {
  this.push(JSON.stringify(line) + '\n');
  done();
};
