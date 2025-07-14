"use client";

import { getTokensUsed } from "@/actions";
import useSWR from "swr";

export default function AiTokensUsed({ userId }: { userId: string }) {
  const fetcher = () => getTokensUsed(userId);

  const { data: tokensUsed, isLoading } = useSWR("tokens-" + userId, fetcher, {
    refreshInterval: 5000,
    shouldRetryOnError: true,
  });
  return (
    <span>
      {tokensUsed
        ? tokensUsed >= 1_000_000
          ? (tokensUsed / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M"
          : tokensUsed >= 1_000
          ? (tokensUsed / 1_000).toFixed(1).replace(/\.0$/, "") + "k"
          : tokensUsed
        : "N/A"}
    </span>
  );
}
