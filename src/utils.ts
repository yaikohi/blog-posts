import { env } from "bun";

export const getURL = (): string => {
  const PORT_EVENTBUS = `4005`;
  const HOST_EVENTBUS = `event-bus-srv`;
  const URL_EVENTBUS = `http://${HOST_EVENTBUS}:${PORT_EVENTBUS}/events`;

  const localURL = `http://localhost:4005/events`;

  if (env.NODE_ENV === "development") {
    return localURL;
  } else {
    return URL_EVENTBUS;
  }
};
