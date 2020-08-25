import React, {useEffect, useState, Component, useContext} from 'react';
import {Form, FormGroup, FormControl, Row, Col, Button, Card} from 'react-bootstrap';
import { RecommenderContext } from '../../contexts'
import queryString from 'query-string';
import { search } from '../../../api'
import { SimpleTrack }  from '../../components'

//these are items in the selectedseeds ?
const TrackSeedItem = props => {
   let data = props.data;

   return (
      <Card>
         {<img src={data.album.images[0].url} width='200' height='200'/>}
         <Card.Body>
            {data.name} by: {data.artists.map(artist => artist.name).join(', ')} id={data.id}
         </Card.Body>
      </Card>
   )
}

const ArtistSeedItem = props => {
   let data = props.data;

   return (
      <Card>

      </Card>
   )
}

const GenreSeedItem = props => {
   let data = props.data;

   return (
      <Card>

      </Card>
   )
}

export default function Seeder(props) {
   const [seedType, setSeedType] = useState('track')
   const [searchInput, setSearchInput] = useState('')
   const [searchRes, setSearchRes] = useState([])
   const [selectedSeeds, setSelectedSeeds] = useState({})

   const [seeds, setSeeds, filters, setFilters] = useContext(RecommenderContext);

   let addSeed = (ev) => {
      console.log(ev)
   };
   let removeSeed;

   let handleChange = ev => {
      ev.preventDefault()

      if (ev.target.name === 'seedType') {
         setSeedType(ev.target.value)
         if (ev.target.value === 'genre')
            console.log('fetch genres and set here')
      }
      else
         setSearchInput(ev.target.value)
   };

   let submit = ev => {
      let query = queryString.stringify({
         q: searchInput,
         type: seedType
      });

      if (seedType === 'genre') {
         console.log('genre search')
      }
      else {
         search(query, data => {
            let seedItems;

            if (seedType === 'track')
               seedItems = data.map((item, idx) => 
               <a style={{cursor: 'pointer'}} onClick={addSeed}>
                  <SimpleTrack track={item} key={idx}/>
               </a>)

            setSearchRes(seedItems)
         })
      }
   };

   return (
      <div>
         <b onClick={() => console.log(`seedType=${seedType}, searchInput=${searchInput}`)}>seeder</b>
         <Card>
            <Row>
               <Col onClick={addSeed}>test1</Col>
               <Col>test2</Col>
            </Row>
         </Card>
         <Form onSubmit={submit}>
            <FormGroup>
               <FormControl name='seedType' as='select' onChange={handleChange} value={seedType}>
                  <option value='track'>Track</option>
                  <option value='artist'>Artist</option>
                  <option value='genre'>Genre</option>
               </FormControl>
               <FormControl placeholder="search seed" onChange={handleChange} value={searchInput}/>
            </FormGroup>
            <Button onClick={submit}>Search seed</Button>
         </Form>
         {searchRes}
      </div>
   )
}