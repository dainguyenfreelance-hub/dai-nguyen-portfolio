import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { createHashRouter, RouterProvider } from "react-router-dom";

import PortfolioApp from "../portfolio/App";
import "../portfolio/styles.css";

const TITLE = "Dai Nguyen — Video Editor";
const DESCRIPTION =
  "Portfolio of Dai Nguyen — video editor, motion designer and 3D artist based in Vietnam.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
    links: [{ rel: "icon", href: "/favicon.png", type: "image/png" }],
  }),
  component: Portfolio,
});

function Portfolio() {
  const [router, setRouter] = useState<ReturnType<typeof createHashRouter> | null>(null);

  useEffect(() => {
    setRouter(
      createHashRouter([
        {
          path: "*",
          element: <PortfolioApp />,
        },
      ]),
    );
  }, []);

  return router ? <RouterProvider router={router} /> : null;
}
