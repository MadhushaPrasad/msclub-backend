import mongoose, { Schema } from "mongoose";
import { IWebinar } from "../interfaces";

const WebinarSchema = new Schema<IWebinar>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    dateTime: { type: Date, required: true },
    time: { type: Date, required: true },
    tags: [{ type: String, required: false }],
    link: { type: String, required: true },
    registrationLink: { type: String, required: false },
    webinarType: { type: String, enum: ["PAST", "UPCOMING"], required: true },
    deletedAt: { type: Date, required: false, default: null },
  },
  { timestamps: true }
);

const WebinarModel = mongoose.model<IWebinar>("webinar", WebinarSchema);

export default WebinarModel;
