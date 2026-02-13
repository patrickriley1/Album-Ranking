import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [albums, setAlbums] = useState([])

  const [albumQuery, setAlbumQuery] = useState("");
  const [artistQuery, setArtistQuery] = useState("");
  const [dateQuery, setDateQuery] = useState("");


  const parseFrontmatter = (content) => {
  const match = content.match(/---([\s\S]*?)---/);
  if (!match) return {};

  const lines = match[1].split("\n");
  const data = {};

  lines.forEach(line => {
    const [key, ...rest] = line.split(":");
    if (!key || rest.length === 0) return;

    let value = rest.join(":").trim();

    if (value === "true") value = true;
    else if (value === "false") value = false;
    else if (!isNaN(value)) value = Number(value);
    else value = value.replace(/^"|"$/g, "");

    data[key.trim()] = value;
  });

  return data;
  };


  useEffect(() => {
    const files = import.meta.glob('./Music Library/*.md', {
      query: '?raw',
      import: 'default'
    });

    const loadAlbums = async () => {
      const loadedAlbums = [];

      for (const path in files) {
        const content = await files[path]();
        const data = parseFrontmatter(content);
        loadedAlbums.push(data);
      }

      loadedAlbums.sort((a, b) => b.rating - a.rating);
      setAlbums(loadedAlbums);
      console.log(loadedAlbums);
    };

    console.log(Object.keys(files));

    loadAlbums();
  }, []);

  const filteredAlbums = albums.filter((album) => {
  const albumMatch = album.album
    ?.toLowerCase()
    .includes(albumQuery.toLowerCase());

  const artistMatch = album.artist
    ?.toLowerCase()
    .includes(artistQuery.toLowerCase());

  const dateMatch =
  dateQuery === ""
    ? true
    : album.date?.toString().includes(dateQuery);

    return albumMatch && artistMatch && dateMatch;
  });

  return (
    <div>
      <div className="header">
        <h1>Album Ranking</h1>
        <div className='search'>
          <h3>Search by: </h3>
          <input type="text" placeholder='album' value={albumQuery} onChange={(e) => setAlbumQuery(e.target.value)} />
          <input type="text" placeholder='artist' value={artistQuery} onChange={(e) => setArtistQuery(e.target.value)} />
          <button
            className="yearButton"
            onClick={() =>
              setDateQuery(prev => prev === "2026" ? "" : "2026")
            }
          >
            2026 Ranking
          </button>
        </div>
      </div>
      <div className="content">
        {filteredAlbums.map((album, index) => (
          <div key={index} className="album">
            <div className="albumRank">#{index + 1}</div>
            <img src={album.cover} alt={album.album} className='albumCover' />
            <h2 className='albumTitle'>{album.album}</h2>
            <h4 className='albumArtist'>{album.artist}</h4>
            <p className='albumRating'>{album.rating}</p>
            {album.Vinyl ? <p className='albumVinyl'>Vinyl: ✔</p> : <p className='albumVinyl'>Vinyl: ✖</p>}
            {album.CD ? <p className='albumCD'>CD: ✔</p> : <p className='albumCD'>CD: ✖</p>}
          </div>
        ))}
        {filteredAlbums.length === 0 && <p className='empty'>No albums found.</p>}
      </div>
      <div className="footer">
      </div>
    </div>
  )
}

export default App
