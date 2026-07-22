"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";

interface AdBannerProps {
    slot?: string;
    format?: "horizontal" | "vertical" | "square";
}

export default function AdBanner({ slot = "default", format = "horizontal" }: AdBannerProps) {
    return null;
}
