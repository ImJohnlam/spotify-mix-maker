import React, {useEffect, useState } from 'react';
import { Button, Card, ListGroup, FormControl } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { getPlaylistItems } from '../../api'
import { SimpleTrack }  from '../components'

export default function Home(props) {
   const [curPlaylistID, setCurPlaylistID] = useState('ustop50')
   const [tracks, setTracks] = useState([])
   let history = useHistory();

   const topChartsMap = {
      'ustop50': '37i9dQZEVXbLRQDuF5jeBp',
      'globaltop50': '37i9dQZEVXbMDoHDwVN2tF'
   }

   useEffect(() => { 
      getPlaylistItems(topChartsMap[curPlaylistID], '', topTracks => {
         // console.log(topTracks)
         setTracks(topTracks.map((track, idx) => <SimpleTrack data={track} key={idx}/>))
      })
   }, [curPlaylistID])

   let handleChange = ev => {
      setCurPlaylistID(ev.target.value)
   }

   return (
      <section className='container'>
         <h1 style={{position:'relative', 'textAlign':'center'}}>Spotify Mix Maker</h1>
         <h2>Features:</h2>
         <ul className='border border-secondary'>
            <li>Embedded Spotify player</li>
            <li>View detailed track characteristics</li>
            <li>Recommendation system with filters and seeds</li>
            <li>Create, edit, view playlists and add recommendations to playlists (login required)</li>
         </ul>
         {/* <Button onClick={() => console.log(JSON.stringify(tracks[0]))}>test</Button>
         
         <Button onClick={() => history.push('/recommender')}>recommender</Button> */}
         <h1>Top Charts:</h1>
         <FormControl as='select' onChange={handleChange} value={curPlaylistID}>
            <option value='ustop50'>US TOP 50</option>
            <option value='globaltop50'>GLOBAL TOP 50</option>
         </FormControl>
         {tracks.length ? 
         <div className='border border-primary' style={{margin:'10px'}}>
            {tracks}
         </div>
         :
         ""
         } 
         
      </section>
   )
}