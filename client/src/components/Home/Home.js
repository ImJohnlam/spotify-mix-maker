import React, {useEffect, useState } from 'react';
import { Button, Card, ListGroup } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

const TrackItem = (props) => {
   return (
      <Card>
         <Card.Body>
            {props.track.name} by: {props.track.artists.map(artist => artist.name).join(', ')}
         </Card.Body>
      </Card>
   )
}

export default function Home(props) {
   const [tracks, setTracks] = useState([])
   let history = useHistory();

   useEffect(() => {
      fetch('http://localhost:3000/top')
      .then(res => res.json())
      .then(data => {
         data.forEach(track => console.log(JSON.stringify(track, null, 2)))
         setTracks(data.map((track, idx) => <TrackItem track={track} key={idx}/>))
      })
      .catch()
   }, [])

   return (
      <section className='container'>
         <h1>HOME PAGE</h1>
         <Button onClick={() => history.push('/details')}>details</Button>
         <Button onClick={() => history.push('/recommender')}>recommender</Button>
         <h1>TOP 50 HITS</h1>
         <Card style={{ width: '18rem' }}>
  <Card.Body>
    <Card.Title>Card Title</Card.Title>
    <Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle>
    <Card.Text>
      Some quick example text to build on the card title and make up the bulk of
      the card's content.
    </Card.Text>
    <Card.Link href="#">Card Link</Card.Link>
    <Card.Link href="#">Another Link</Card.Link>
  </Card.Body>
</Card>
         {tracks}
      </section>
   )
}