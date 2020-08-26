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
   const [selectedSeedObjs, setSelectedSeedsObjs] = useState({})

   const [seeds, setSeeds, filters, setFilters] = useContext(RecommenderContext);

   let calcNumSeeds = () => {
      return Object.keys(seeds).reduce((acc, field) => {
         console.log(`field=${field} acc=${acc} seeds[field]=${seeds[field]}`)
         return acc + (seeds[field] ? seeds[field].length : 0)
      }
      , 0)

   }

   let addSeed = (targetProps) => {
      let seedArrName = `seed_${targetProps.seedType}s`;
      let seedArr = seeds[seedArrName] && seeds[seedArrName].slice()
      let newSeedField = {};

      if (calcNumSeeds() === 5) return;

      console.log('(before)seeds=' + JSON.stringify(seeds, null, 2))
      console.log(`(before)seedArr=${seedArr}`)
      if (seedArr)
         seedArr.push(targetProps.id)
      else
         seedArr = [targetProps.id]

      
      newSeedField[seedArrName] = seedArr
      setSeeds({...seeds, ...newSeedField})
      console.log(`(after)seedArr=${seedArr}`)
      console.log(`newSeedField=${JSON.stringify(newSeedField)}`)
      

      console.log(`numSeeds=${calcNumSeeds()}`)
      console.log('(after)seeds=' + JSON.stringify(seeds, null, 2))
      console.log(this)
   };

   let removeSeed = (ev) => {

   };

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

      ev.preventDefault()

      if (seedType === 'genre') {
         console.log('genre search')
      }
      else {
         search(query, data => {
            let seedItems;

            if (seedType === 'track')
               seedItems = data.map((item, idx) => 
               
                  <SimpleTrack id={item.id} seedType='track' onCardClick={addSeed} data={item} key={idx}/>
               )

            setSearchRes(seedItems)
         })
      }
   };

   return (
      <div>
         <b onClick={() => console.log(`seedType=${seedType}, searchInput=${searchInput}`)}>seeder</b>
         <Card>
            <Row>
               <Col onClick={() => console.log(searchRes[0])}>test1</Col>
               <Col onClick={() => console.log(JSON.stringify(seeds, null, 2))}>test2</Col>
            </Row>
            <Row>
               {}
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