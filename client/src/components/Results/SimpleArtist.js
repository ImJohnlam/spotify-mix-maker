import React, {useEffect, useContext } from 'react';
import { Button, Card, ListGroup } from 'react-bootstrap';

export default props => {
   let data = props.data;

   let openInSpotify = () => window.open(data.external_urls.spotify)
   
   return (
      <div>
         <Card style={{cursor: 'pointer'}} onClick={
          data.onCardClick ? () => data.onCardClick(data) : openInSpotify}>
            <img src={data.images.length && data.images[0].url} width='200' height='200'/>
            <Card.Body>
               {data.name} {data.genres.length && `genres: ${data.genres.join(', ')}`} id={data.id}
            </Card.Body>
         </Card>
         
         <Button onClick={openInSpotify}>Spotify</Button>
      </div>
   )
}