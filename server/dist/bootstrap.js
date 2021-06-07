"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const enrollUser_1 = require("./enrollUser");
function bootstrap(organization) {
    return __awaiter(this, void 0, void 0, function* () {
        const config = {
            appAdmin: organization + 'admin',
            appAdminSecret: organization + 'adminpw',
            orgMSPID: organization + 'MSP',
            organization: organization,
            caName: 'ca.' + organization + '.unizg.hr',
            gatewayDiscovery: { enabled: true, asLocalhost: true }
        };
        config_1.saveConfig(config);
        console.log('Enrolling admin for ' + organization);
        const adminCreated = yield enrollUser_1.enrollUser(config, config.appAdmin);
        if (!adminCreated.success) {
            throw adminCreated.error;
        }
        console.log('Admin successfully enrolled');
        console.log('Enrolling students');
        const responses = yield Promise.all([
            enrollUser_1.enrollUser(config, organization + 'student1'),
            enrollUser_1.enrollUser(config, organization + 'student2'),
            enrollUser_1.enrollUser(config, organization + 'student3'),
            enrollUser_1.enrollUser(config, organization + 'student4'),
            enrollUser_1.enrollUser(config, organization + 'student5'),
        ]);
        if (!responses.every(res => res.success)) {
            const errors = responses.filter(res => !res.success);
            console.error(errors.map(err => err.error).join('\n'));
            throw errors[0].error;
        }
        console.log('Students successfully enrolled');
    });
}
bootstrap(process.argv[2]);
// SHEMA DA NE MOZE FER DODJELIVAT FSBU I OBRNUTO
// RAZLICITI SERVERI ZA FER I FSB ALI ISTI NETWORK
//# sourceMappingURL=bootstrap.js.map