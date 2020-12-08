import React, {useEffect, useState, Component, useContext} from 'react';
import {Button} from 'react-bootstrap';
import { RecommenderContext } from '../../contexts'
import queryString from 'query-string';
import { getRecommendations, addTrackToPlaylist } from '../../../api'
import { SimpleTrack }  from '../../components'


export default function RecResults(props) {
   const [recs, setRecs] = useState([])
   const [sortField, setSortField] = useState('')
   const [seeds, setSeeds, calcNumSeeds, filters, setFilters, curPlaylistID,
    setCurPlaylistID, playlistUpdate, setPlaylistUpdate] = useContext(RecommenderContext)

   let submit = ev => {
      let seedStrs = {...seeds};
      let query;
      
      Object.keys(seedStrs).forEach(seedKey => seedStrs[seedKey] = seedStrs[seedKey].join(','))
      query = queryString.stringify({...seedStrs, ...filters})
      console.log(query)
      getRecommendations(query, tracks => setRecs(tracks))

   }

   let addTrack = data => {
      if (curPlaylistID) {
         console.log('adding track to playlist')
         addTrackToPlaylist(curPlaylistID, {uris: [data.uri]}, data => {
            console.log(JSON.stringify(data))
            setPlaylistUpdate(data)
         })
      }
   }

   let mapReccomendations = () => {
      return recs.map(rec => {
         rec.onCardClick = addTrack
         return <SimpleTrack data={rec}/>
      })
   }

   // TODO: make onCardClick (which calls setPlaylistUpdate)
   // TODO: sort
   return (
      <div>
         <h1 onClick={() => {console.log(JSON.stringify(recs, null, 2)); console.log(`# recomends = ${recs.length}`)}}>Recommendations</h1>
         {/* <Button onClick={() => addTrackToPlaylist('7hudEXa3coGjanstJBgtMf', '?uris=spotify:track:3xaugmCyXrVkrDTXbFkMW3', data => console.log(JSON.stringify(data, null, 2)))}>TEST ADD TRACK TO PLAYLIST</Button> */}
         <Button onClick={submit} disabled={!calcNumSeeds()}>Get Recommendations</Button>
         {mapReccomendations()}


      </div>
   )
}