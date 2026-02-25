import { createApi } from "unsplash-js";

export const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY!,
});

export async function getPhotos(query: string) {
  const result = await unsplash.search.getPhotos({
    query,
    page: 1,
    perPage: 10,
    orientation: "landscape",
  });

  if (result.type === "error") {
    console.error(result.errors);
    return [];
  }

  return result.response.results;
}
