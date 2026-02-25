import { createApi } from "unsplash-js";

export const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY!,
});

export async function getPhotos(query: string, page = 1, perPage = 20) {
  const result = await unsplash.search.getPhotos({
    query,
    page,
    perPage,
    orientation: "landscape",
  });

  if (result.type === "error") {
    console.error(result.errors);
    return [];
  }

  return result.response.results;
}

export async function getRandomPhotos(count = 20) {
  const result = await unsplash.photos.getRandom({
    count,
    // contentFilter: "low",

    orientation: "landscape",
  });

  if (result.type === "error") {
    console.error(result.errors);
    return [];
  }

  const data = result.response;
  return Array.isArray(data) ? data : [data];
}
