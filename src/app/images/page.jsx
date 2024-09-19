 "use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

const Page = () => {
  const [data, setData] = useState([]);
  const [album, setAlbum] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/photos"
      );
      setData(response.data);

      // Group items by albumId
      const albums = {};
      for (let item of response.data) {
        if (!albums[item.albumId]) {
          albums[item.albumId] = [];
        }
        albums[item.albumId].push(item);
      }
      setAlbum(albums); // Store the grouped data in the state

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>All Data</h1>
      <ul>
        {data.map((item) => (
          <div key={item.id}>
            <li>{item.id}</li>
          </div>
        ))}
      </ul>

      <h2>Grouped by AlbumId</h2>
      {Object.keys(album).map((albumId) => (
        <div key={albumId}>
          <h3>Album {albumId}</h3>
          <ul>
            {album[albumId].map((item) => (
              <li key={item.id}>{item.title}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Page;
