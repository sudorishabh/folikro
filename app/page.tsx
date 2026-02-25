import { getPhotos } from "@/server/unsplash";
import Image from "next/image";
export default async function HomePage() {
  const photos = await getPhotos("nature");
  console.log(photos);
  return (
    <main className='grid grid-cols-2 gap-4 p-6'>
      {photos.map((photo) => (
        <div key={photo.id}>
          <Image
            src={photo.urls.small}
            alt={photo.alt_description ?? "Unsplash image"}
            width={400}
            height={300}
            className='rounded-lg'
          />
        </div>
      ))}
    </main>
  );
}
