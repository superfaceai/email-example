"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuperfaceClient = void 0;
var one_sdk_1 = require("@superfaceai/one-sdk");
var send_email_1 = require("./types/communication/send-email");
var user_repos_1 = require("./types/vcs/user-repos");
var geocoding_1 = require("./types/address/geocoding");
var typeDefinitions = __assign(__assign(__assign({}, send_email_1.communicationSendEmail), user_repos_1.vcsUserRepos), geocoding_1.addressGeocoding);
exports.SuperfaceClient = one_sdk_1.createTypedClient(typeDefinitions);
