import { Document } from "mongoose";

interface IWebinar extends Document {
    title: string;
    description: string;
    imageUrl: string;
    dateTime: Date;
    time: Date;
    tags?: string[];
    link?: string;
    registrationLink?: string;
    webinarType: string;
    deletedAt?: Date;
};

export type { IWebinar };