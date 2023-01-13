import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import "@unocss/reset/tailwind.css";
import "uno.css";
import "antd/dist/reset.css";
import router from "./router";
import { queryClient } from "./http";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </>
);
