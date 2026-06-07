"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";

export function UserSync() {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded || !user) return;

    fetch("/api/sync-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        email: user.emailAddresses[0].emailAddress,
        name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
      }),
    });
  }, [isLoaded, user]);

  return null;
}   