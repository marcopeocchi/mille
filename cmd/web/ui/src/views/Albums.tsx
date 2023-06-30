import { useEffect, useState } from "react"
import { getHTTPEndpoint } from "../utils/url"
import { Link } from "react-router-dom"
import AlbumImage from "../components/AlbumImage"

export default function Albums() {
  const [albums, setAlbums] = useState<Album[]>([])
  const [page, setPage] = useState(1)

  const fetcher = async (page: number) => {
    const res = await fetch(`${getHTTPEndpoint()}/api/album/all?page=${page}`)
    const data: Paginated<Album> = await res.json()
    setAlbums(data.list)
  }

  useEffect(() => {
    fetcher(page)
  }, [page])

  return (
    <div className="px-8 pt-8">
      <h1 className="font-semibold text-2xl">
        Albums
      </h1>
      <div className='border-b pt-4' />
      <div className="
        pt-6 px-8 pb-32 
        grid 
        grid-cols-1 
        sm:grid-cols-2 md:grid-cols-3 
        lg:grid-cols-4 xl:grid-cols-5 
        2xl:grid-cols-6
        gap-6"
      >
        {albums.map(album => (
          <Link
            key={album.id}
            to={`/album/${album.id}`}
            className="flex justify-start items-center flex-col gap-1 cursor-pointer"
          >
            <AlbumImage
              src={`${getHTTPEndpoint()}/static/img/${album.picture}`}
            />
            <div className="text-center">
              {album.title}
            </div>
            <div className="text-sm text-neutral-600">
              {album.artist}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}