import { PostDBType, PostType } from "./types";

export const DB: PostDBType = {};
export const posts = (): PostType[] => {
  return Object.entries(DB).map(([k, v]) => ({
    id: k,
    title: v.title,
    content: v.content,
    comments: v.comments,
  }));
};
