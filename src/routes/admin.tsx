import { createFileRoute } from "@tanstack/react-router";

import ProductionAdmin from "../portfolio/ProductionAdmin";
import "../portfolio/styles.css";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Portfolio Admin — Dai Nguyen" },
      { name: "robots", content: "noindex, nofollow" },
    ],
    links: [{ rel: "icon", href: "/favicon.png", type: "image/png" }],
  }),
  component: ProductionAdmin,
});
