import { Elysia, t } from "elysia";
import { PostDBType, PostType } from "./types";
import cors from "@elysiajs/cors";
// --- POST
const PORT = 4000;

// --- PORTS
const PORT_EVENTBUS = 4005;
// --- HOSTS
const HOST_EVENTBUS = "event-bus-srv";
// --- EVENT-BUS -- URL
export const url = `http://${HOST_EVENTBUS}:${PORT_EVENTBUS}/events`;

// --- CONSTS
const DB: PostDBType = {};
const posts = (): PostType[] => {
  return Object.entries(DB).map(([k, v]) => ({
    id: k,
    title: v.title,
    content: v.content,
    comments: v.comments,
  }));
};

// -- APP
const app = new Elysia();
// --- MIDDLEWARE
app
  .use(cors());
// --- ROUTES
app
  .group("/events", (app) =>
    app
      .post("/", ({ body, set }) => {
        set.status = "OK";
        console.log(body);
      }))
  .group("/posts", (app) =>
    app
      .get("/", () => posts)
      .post("/create", async ({ body, set }) => {
        const postId = crypto.randomUUID();
        const newPost: PostType = {
          id: postId,
          title: body.title,
          content: body.content,
          comments: [],
        };

        DB[postId] = newPost;

        await sendPostCreatedEvent({ post: newPost });

        set.status = "OK";

        return { success: true, message: "Post was created." };
      }, {
        body: t.Object({
          title: t.String(),
          content: t.String(),
        }),
      }));

// --- START APP
app
  .listen(PORT, () =>
    console.log(
      `🦊 Elysia is running the 'posts' service at ${app.server?.hostname}:${app.server?.port}`,
    ));

export async function sendPostCreatedEvent({ post }: { post: PostType }) {
  const url = `http://${HOST_EVENTBUS}:${PORT_EVENTBUS}/events`;
  const event = { type: "post.created", data: { post } };

  try {
    await fetch(url, {
      method: "POST",
      body: JSON.stringify(event),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.error(err);
  }
}
