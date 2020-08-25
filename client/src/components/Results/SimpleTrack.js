import React, {useEffect, useContext } from 'react';
import { Button, Card, ListGroup } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import {PlayerContext} from '../contexts'

export default props => {
   let [id, setId] = useContext(PlayerContext)
   let history = useHistory();
   let track = props.track;

   // TODO: change buttons to <a>
   return (
      <Card>
         <img src={track.album.images[0].url} width='200' height='200'/>
         <Card.Body>
            {track.name} by: {track.artists.map(artist => artist.name).join(', ')} id={track.id}
         </Card.Body>
         <Button onClick={() => setId(track.id)}>Play</Button>
         <Button onClick={() => {history.push(`/details/${track.id}`); window.scrollTo(0, 0)}}>Details</Button>
         <Button onClick={() => window.open(track.external_urls.spotify)}>Spotify</Button>
      </Card>
   )
}