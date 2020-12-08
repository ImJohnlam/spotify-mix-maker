import React, { useState, useContext } from 'react';
import { Button } from 'react-bootstrap';
import { RecommenderContext } from '../../contexts';
import queryString from 'query-string';
import { getRecommendations, addTrackToPlaylist } from '../../../api';
import { SimpleTrack }  from '../../components';


export default function RecResults(props) {
   const [recs, setRecs] = useState([]);
   const [getRecState, setRecState] = useContext(RecommenderContext);

   const submit = ev => {
      const seeds = getRecState('SEEDS');
      const filters = getRecState('FILTERS');
      const seedStrs = {...seeds};
      let query;
      
      Object.keys(seedStrs).forEach(seedKey => seedStrs[seedKey] = seedStrs[seedKey].join(','));
      query = queryString.stringify({...seedStrs, ...filters});
      getRecommendations(query, tracks => setRecs(tracks));
   }

   const addTrack = data => {
      const curPlaylistID = getRecState('CUR_PLAYLIST_ID');

      if (curPlaylistID)
         addTrackToPlaylist(curPlaylistID, {uris: [data.uri]}, data => setRecState('PLAYLIST_UPDATE', data));
   }

   const mapReccomendations = () => {
      return recs.map((rec, idx) => {
         rec.onCardClick = addTrack;
         return <SimpleTrack data={rec} key={idx}/>;
      });
   }

   return (
      <div>
         <h1>Recommendations</h1>
         <Button onClick={submit} disabled={!getRecState('NUM_SEEDS')}>Get Recommendations</Button>
         {mapReccomendations()}
      </div>
   )
}