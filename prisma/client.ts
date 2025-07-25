import { PrismaClient } from "@prisma/client";
import { EventEmitter } from "events";

EventEmitter.defaultMaxListeners = 20; // Avoid Node warnings globally

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export default prisma;
