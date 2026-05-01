/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Schema, Document } from "mongoose";

export interface IEntry extends Document {
  userId: string;
  date: string;
  title: string;
  contentHtml: string;
  contentText: string;
  contentJson: any;
  wordCount: number;
  mood: number | null;
  createdAt: Date;
  updatedAt: Date;
}

const EntrySchema = new Schema<IEntry>(
  {
    userId: { type: String, required: true, index: true },
    date: { type: String, required: true },
    title: { type: String, default: "" },
    contentHtml: { type: String, default: "" },
    contentText: { type: String, default: "" },
    contentJson: { type: Schema.Types.Mixed, default: {} },
    wordCount: { type: Number, default: 0 },
    mood: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },
  },
  { timestamps: true },
);

EntrySchema.index({ userId: 1, date: 1 }, { unique: true });

export const Entry =
  mongoose.models.Entry || mongoose.model<IEntry>("Entry", EntrySchema);
