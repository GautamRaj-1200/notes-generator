var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import cron from "node-cron";
import dayjs from "dayjs";
import { User } from "../models/user.model.js";
export const startCreditScheduler = () => {
    // 0 - hour, 0 - minute, 1 - 1st day of the month, * * - Any month and any day of the week
    cron.schedule("0 0 1 * *", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Refreshing credits for all users");
        // Get All Users
        const users = yield User.find();
        // For every user update the credit, if lastCreditRefresh date and present date has difference of more than or equal to 1 month
        users.forEach((user) => __awaiter(void 0, void 0, void 0, function* () {
            if (dayjs().diff(user.lastCreditRefresh, "month") >= 1) {
                user.credits = 5;
                user.lastCreditRefresh = new Date();
                yield user.save();
            }
        }));
        console.log("Credits refreshed for all users");
    }));
};
