/* automatically generated by JSCoverage - do not edit */
try {
  if (typeof top === 'object' && top !== null && typeof top.opener === 'object' && top.opener !== null) {
    // this is a browser window that was opened from another window

    if (! top.opener._$jscoverage) {
      top.opener._$jscoverage = {};
    }
  }
}
catch (e) {}

try {
  if (typeof top === 'object' && top !== null) {
    // this is a browser window

    try {
      if (typeof top.opener === 'object' && top.opener !== null && top.opener._$jscoverage) {
        top._$jscoverage = top.opener._$jscoverage;
      }
    }
    catch (e) {}

    if (! top._$jscoverage) {
      top._$jscoverage = {};
    }
  }
}
catch (e) {}

try {
  if (typeof top === 'object' && top !== null && top._$jscoverage) {
    _$jscoverage = top._$jscoverage;
  }
}
catch (e) {}
if (typeof _$jscoverage !== 'object') {
  _$jscoverage = {};
}
if (! _$jscoverage['main.js']) {
  _$jscoverage['main.js'] = [];
  _$jscoverage['main.js'][1] = 0;
  _$jscoverage['main.js'][2] = 0;
  _$jscoverage['main.js'][3] = 0;
  _$jscoverage['main.js'][4] = 0;
  _$jscoverage['main.js'][6] = 0;
  _$jscoverage['main.js'][7] = 0;
  _$jscoverage['main.js'][8] = 0;
  _$jscoverage['main.js'][9] = 0;
  _$jscoverage['main.js'][10] = 0;
  _$jscoverage['main.js'][11] = 0;
  _$jscoverage['main.js'][12] = 0;
  _$jscoverage['main.js'][13] = 0;
  _$jscoverage['main.js'][14] = 0;
  _$jscoverage['main.js'][15] = 0;
  _$jscoverage['main.js'][16] = 0;
  _$jscoverage['main.js'][19] = 0;
  _$jscoverage['main.js'][21] = 0;
}
_$jscoverage['main.js'].source = ["var server = require('./server');","var router = require('./router');","var requestHandlers = require('./requestHandlers');","var chatServer = require('./chatServer.js');","","var handle = {};","handle[\"/register\"] = requestHandlers.register;","handle[\"/login\"] = requestHandlers.login;","handle[\"/logoff\"] = requestHandlers.logoff;","handle[\"/post\"] = requestHandlers.post;","handle[\"/profile\"] = requestHandlers.showProfile;","handle[\"/add\"] = requestHandlers.add;","handle[\"/friends\"] = requestHandlers.friends;","handle[\"/online\"] = requestHandlers.onlineFriends;","handle[\"/search\"] = requestHandlers.search;","handle[\"/content\"] = requestHandlers.getTemplate;","","//Allows the chat-server to communicate with the db","chatServer.setInactive(requestHandlers.chatDC);","","server.start(router.route, handle, requestHandlers.connectDB, chatServer);"];
_$jscoverage['main.js'][1]++;
var server = require("./server");
_$jscoverage['main.js'][2]++;
var router = require("./router");
_$jscoverage['main.js'][3]++;
var requestHandlers = require("./requestHandlers");
_$jscoverage['main.js'][4]++;
var chatServer = require("./chatServer.js");
_$jscoverage['main.js'][6]++;
var handle = {};
_$jscoverage['main.js'][7]++;
handle["/register"] = requestHandlers.register;
_$jscoverage['main.js'][8]++;
handle["/login"] = requestHandlers.login;
_$jscoverage['main.js'][9]++;
handle["/logoff"] = requestHandlers.logoff;
_$jscoverage['main.js'][10]++;
handle["/post"] = requestHandlers.post;
_$jscoverage['main.js'][11]++;
handle["/profile"] = requestHandlers.showProfile;
_$jscoverage['main.js'][12]++;
handle["/add"] = requestHandlers.add;
_$jscoverage['main.js'][13]++;
handle["/friends"] = requestHandlers.friends;
_$jscoverage['main.js'][14]++;
handle["/online"] = requestHandlers.onlineFriends;
_$jscoverage['main.js'][15]++;
handle["/search"] = requestHandlers.search;
_$jscoverage['main.js'][16]++;
handle["/content"] = requestHandlers.getTemplate;
_$jscoverage['main.js'][19]++;
chatServer.setInactive(requestHandlers.chatDC);
_$jscoverage['main.js'][21]++;
server.start(router.route, handle, requestHandlers.connectDB, chatServer);
