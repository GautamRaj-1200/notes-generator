var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
export const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dbConnectionInstance = yield mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);
        console.log("MongoDB Connected!!!!! Connection Instance: ", dbConnectionInstance.connection.host);
    }
    catch (error) {
        let errorMessage = "Failed!!!";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        console.log("Error occurred while connecting to DB: ", errorMessage);
    }
});
