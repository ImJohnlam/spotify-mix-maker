import React, {useEffect, useContext } from 'react';
import { Button, Card, ListGroup } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import {PlayerContext} from '../contexts'

export default props => {
   let [id, setId] = useContext(PlayerContext)
   let history = useHistory();
   let data = props.data;

   let openInSpotify = () => window.open(data.external_urls.spotify)

   // TODO: change buttons to <a> or img
   // TODO: rm onCardClick
   // NOTE: consider Nav/tabs for more track details
   return (
      <div>
         <Card style={{cursor: 'pointer'}} onClick={
          data.onCardClick ? () => data.onCardClick(data) : openInSpotify}>
            <img src={data.imgSrc} width='200' height='200'/>
            <Card.Body>
               {data.name}
            </Card.Body>
         </Card>
         <Button onClick={openInSpotify}>Spotify</Button>
      </div>
   )
}