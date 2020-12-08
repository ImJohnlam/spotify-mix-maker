import React, { useEffect, useState } from 'react';
import { FormControl } from 'react-bootstrap';
import { getPlaylistItems } from '../../api';
import { SimpleTrack }  from '../components';

export default function Home(props) {
   const [curPlaylistID, setCurPlaylistID] = useState('ustop50');
   const [tracks, setTracks] = useState([]);

   const topChartsMap = {
      'ustop50': '37i9dQZEVXbLRQDuF5jeBp',
      'globaltop50': '37i9dQZEVXbMDoHDwVN2tF',
      'globalviral50': '37i9dQZEVXbLiRSasKsNU9'
   };

   useEffect(() => { 
      getPlaylistItems(topChartsMap[curPlaylistID], '', topTracks => {
         setTracks(topTracks.map((track, idx) => <SimpleTrack data={track} key={idx}/>));
      })
   }, [curPlaylistID]);

   return (
      <section className='container'>
         <h1 style={{'textAlign':'center'}}>Spotify Mix Maker</h1>
         <h2>Features:</h2>
         <ul className='border border-secondary'>
            <li>Embedded Spotify player</li>
            <li>View detailed track characteristics</li>
            <li>Recommendation system with filters and seeds</li>
            <li>Create, edit, view playlists and add recommendations to playlists (login required)</li>
         </ul>
         <h1>Top Charts:</h1>
         <FormControl as='select' onChange={ev => setCurPlaylistID(ev.target.value)} value={curPlaylistID}>
            <option value='ustop50'>US TOP 50</option>
            <option value='globaltop50'>GLOBAL TOP 50</option>
            <option value='globalviral50'>GLOBAL VIRAL 50</option>
         </FormControl>
         {tracks.length
          ? <div className='border border-primary' style={{margin:'10px'}}>
               {tracks}
            </div>
          : ""
         }     
      </section>
   );
}