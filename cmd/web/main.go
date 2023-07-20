package main

import (
	"embed"
	"flag"
	"fmt"
	"io/fs"
	"log"
	"net/http"
	"path/filepath"

	"github.com/glebarez/sqlite"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/marcopeocchi/mille/internal/album"
	"github.com/marcopeocchi/mille/internal/metadata"
	"github.com/marcopeocchi/mille/internal/middlewares"
	"github.com/marcopeocchi/mille/internal/stream"
	"github.com/marcopeocchi/mille/internal/track"
	"gorm.io/gorm"
)

var (
	//go:embed ui/dist
	app   embed.FS
	port  int
	cache string
)

func init() {
	flag.IntVar(&port, "p", 8080, "port to listen at")
	flag.StringVar(&cache, "c", ".cache", "path of cache directory")
	flag.Parse()
}

func main() {
	db, err := gorm.Open(sqlite.Open("data.db"))
	if err != nil {
		log.Fatalln(err)
	}

	httpClient := http.DefaultClient
	defer httpClient.CloseIdleConnections()

	build, _ := fs.Sub(app, "ui/dist")

	sh := middlewares.NewSpaHandler("index.html", build)
	sh.AddClientRoute("/album")
	sh.AddClientRoute("/albums")
	sh.AddClientRoute("/artists")
	sh.AddClientRoute("/songs")

	r := chi.NewRouter()
	r.Use(middlewares.CORS)
	r.Use(middleware.Logger)

	// Dependency Injection containers
	albumContainer := album.Container(db)
	trackContainer := track.Container(db)
	streamContainer := stream.Container(db)
	metadataContainer, _ := metadata.Container(httpClient)

	r.Route("/api", func(r chi.Router) {
		r.Get("/stream/{id}", streamContainer.StreamFromStorage())

		r.Route("/album", func(r chi.Router) {
			r.Get("/all", albumContainer.FindAllAlbums())
			r.Get("/latest", albumContainer.Latest())
			r.Get("/random", albumContainer.RandomAlbum())
			r.Get("/id/{id}", albumContainer.FindAlbumByID())
			r.Get("/any/{query}", albumContainer.FindAny())
			r.Get("/like/{title}", albumContainer.FindAlbumByTitleLike())
			r.Get("/title/{title}", albumContainer.FindAlbumByTitle())
			r.Get("/artist/{artist}", albumContainer.FindAlbumByArtist())
		})

		r.Route("/track", func(r chi.Router) {
			r.Get("/all", trackContainer.FindAllTracks())
			r.Get("/id/{id}", trackContainer.FindTrackByID())
			r.Get("/like/{title}", trackContainer.FindTrackByTitleLike())
			r.Get("/title/{title}", trackContainer.FindTrackByTitle())
			r.Get("/genre/{genre}", trackContainer.FindTrackByGenre())
			r.Get("/artist/{artist}", trackContainer.FindTrackByArtist())
		})

		r.Route("/metadata", func(r chi.Router) {
			r.Get("/{name}", metadataContainer.GetAlbumMetadata())
		})
	})

	r.Route("/static", func(r chi.Router) {
		r.Get("/img/{id}", func(w http.ResponseWriter, r *http.Request) {
			id := chi.URLParam(r, "id")
			http.ServeFile(w, r, filepath.Join(cache, id))
		})
	})

	r.Get("/*", sh.Handler())

	http.ListenAndServe(fmt.Sprintf(":%d", port), r)
}
