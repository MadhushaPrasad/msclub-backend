import mongoose, { Schema } from "mongoose";
import { IEvent } from "../interfaces";

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    dateTime: { type: Date, required: true },
    tags: [{ type: String, required: false }],
    link: { type: String, required: false },
    registrationLink: { type: String, required: false },
    eventType: { type: String, enum: ["PAST", "UPCOMING"], required: true },
    deletedAt: { type: Date, required: false, default: null },
    createdBy: { type: Schema.Types.ObjectId, required: true, ref: "users" },
    updatedBy: [
      {
        user: { type: Schema.Types.ObjectId, required: false, ref: "users" },
        updatedAt: { type: Date, required: false },
      },
    ],
    deletedBy: {
      type: Schema.Types.ObjectId,
      required: false,
      default: null,
      ref: "users",
    },
  },
  { timestamps: true }
);

const EventModel = mongoose.model<IEvent>("event", EventSchema);

export default EventModel;
