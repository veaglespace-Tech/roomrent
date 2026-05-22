"use client";

import { PropsWithChildren, useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "@/store";
import { setCredentials } from "@/store/slices/auth-slice";

function Hydrator({ children }: PropsWithChildren) {
  useEffect(() => {
    const raw = localStorage.getItem("roomrent_user");
    if (raw) {
      store.dispatch(setCredentials(JSON.parse(raw)));
    }
  }, []);

  return children;
}

export function Providers({ children }: PropsWithChildren) {
  return (
    <Provider store={store}>
      <Hydrator>{children}</Hydrator>
    </Provider>
  );
}
