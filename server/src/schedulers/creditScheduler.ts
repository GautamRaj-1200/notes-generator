import cron from "node-cron"
import dayjs from "dayjs";
import { User } from "../models/user.model.js";

export const startCreditScheduler = () => {
    // 0 - minute, 0 - hour, 1 - 1st day of the month, * * - Any month and any day of the week
    cron.schedule("0 0 1 * *", async () => {
        console.log("Refreshing credits for all users");

        // Get All Users
        const users = await User.find();

        // For every user update the credit, if lastCreditRefresh date and present date has difference of more than or equal to 1 month
        users.forEach(async (user) => {
            if (dayjs().diff(user.lastCreditRefresh, "month") >= 1) {
                user.credits = 5;
                user.lastCreditRefresh = new Date();
                await user.save();
            }
        })
        console.log("Credits refreshed for all users");
    })
}

