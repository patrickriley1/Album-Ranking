import { useEffect, useState } from 'react'
import './App.css'
import matter from 'gray-matter'

function App() {
  const [albums, setAlbums] = useState([])

  useEffect(() => {
    //this is how I'm importing the md files
    const files = import.meta.glob('./Music Library/*.md', {as : 'raw'})

    //define a function to load the albums from the md files
    const loadAlbums = async () => {
      const loadedAlbums = [];

      for (const path in files) {
        const content = await files[path]();
        const { data } = matter(content);

        loadedAlbums.push(data);
      }

      //sort albums by rating
      loadedAlbums.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
      setAlbums(loadedAlbums);
    }
    
    //call this function
    loadAlbums();

    //remember empty dependency array so it runs once intially
  }, [])

  return (
    <div>
      <div className="header">
        <h1>Album Ranking</h1>
      </div>
      <div className="content">
        {albums.map((album, index) => (
          <div key={index} className="album">
            <img src={album.cover} alt={album.title} />
            <h2>{album.title}</h2>
            <h4>{album.artist}</h4>
            <p>{album.rating}</p>
            {album.Vinyl ? <p>Vinyl: ✔</p> : <p>Vinyl: ✖</p>}
            {album.CD ? <p>CD: ✔</p> : <p>CD: ✖</p>}
          </div>
        ))}
      </div>
      <div className="footer">
        <p>I created this view by importing markdown files from my obsidian vault.</p>
      </div>
    </div>
  )
}

export default App
