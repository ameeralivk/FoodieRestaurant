

import Subscription from "../models/subscription";

export async function updateSubscriptionStatuses() {
  const now = new Date();

  // Activate subscriptions that are pending or queued and startDate has passed
  await Subscription.updateMany(
    {
      status: { $in: ["pending", "queued"] }, 
      startDate: { $lte: now },
      renewalDate: { $gte: now },
    },
    { $set: { status: "active" } },
  );

  // Expire subscriptions whose endDate has passed
  await Subscription.updateMany(
    {
      status: "active",
      renewalDate: { $lt: now },
    },
    { $set: { status: "expired" } },
  );

  // Optional: mark subscriptions not started yet as pending
  await Subscription.updateMany(
    {
      status: { $ne: "pending" },
      startDate: { $gt: now },
    },
    { $set: { status: "pending" } },
  );
}

/**
 * Start the subscription status scheduler
 */
export function startSubscriptionScheduler() {
  // Run every 1 minute
  setInterval(updateSubscriptionStatuses,12 * 60 * 60 * 1000);
  console.log("[Subscription Scheduler] Started...");
}
