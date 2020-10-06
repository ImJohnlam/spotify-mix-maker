import React, {useEffect, useState, Component, useContext} from 'react';
import {Form, FormGroup, FormControl, Row, Col, Button, Card} from 'react-bootstrap';
import { RecommenderContext } from '../../contexts'
import queryString from 'query-string';
import { search, getGenres } from '../../../api'
import { SimpleTrack, SimpleArtist, SimpleGenre }  from '../../components'

const SeedResItem = props => {
   const [seeds, setSeeds] = useContext(RecommenderContext);

   return (
      <Card style={{cursor: 'pointer'}}onClick={() => props.onCardClick(props)}>
         <img src={props.imgSrc} width='150' height='150'/>
         <Card.Body>
            {props.name}
            {props.desc}
         </Card.Body>
      </Card>
   )
}
const SeedSelectedItem = props => {
   const [seeds, setSeeds] = useContext(RecommenderContext);
   
   return (
      <Col>
         <Card style={{cursor: 'pointer'}} onClick={() => props.onCardClick(props.id, props.type)}>
            <img src={props.imgSrc} width='100' height='100'/>
            {props.name}
         </Card>
      </Col>
   )
}

export default function Seeder(props) {
   const [seedType, setSeedType] = useState('none')
   const [searchInput, setSearchInput] = useState('')
   const [searchRes, setSearchRes] = useState([])
   const [selectedSeedObjs, setSelectedSeedsObjs] = useState([])

   const [seeds, setSeeds, calcNumSeeds, filters, setFilters] = useContext(RecommenderContext);

   let addSeed = (targetProps) => {
      let seedArrName = `seed_${targetProps.type}s`;
      // NOTE: might not need slice?
      let seedArr = seeds[seedArrName] && seeds[seedArrName].slice()
      let newSeedField = {};
      let newSelectedSeeds = selectedSeedObjs.slice()

      if (calcNumSeeds() === 5 || (seedArr && seedArr.indexOf(targetProps.id) !== -1)) return;

      console.log(searchInput)
      console.log('(before)seeds=' + JSON.stringify(seeds, null, 2))
      console.log(`(before)seedArr=${seedArr}`)
      if (seedArr)
         seedArr.push(targetProps.id)
      else
         seedArr = [targetProps.id]

      
      newSeedField[seedArrName] = seedArr
      newSelectedSeeds.push(targetProps)
      setSeeds({...seeds, ...newSeedField})
      setSelectedSeedsObjs(newSelectedSeeds)
      
      
      console.log(`(after)seedArr=${seedArr}`)
      console.log(`newSeedField=${JSON.stringify(newSeedField)}`)
      

      console.log(`numSeeds=${calcNumSeeds()}`)
      console.log('(after)seeds=' + JSON.stringify(seeds, null, 2))
   };

   let removeSeed = (id, type) => {
      let seedArrName = `seed_${type}s`;
      let seedArr = seeds[seedArrName]
      let newSeeds = {...seeds}

      if (seedArr.length === 1)
         delete newSeeds[seedArrName]
      else
         newSeeds[seedArrName] = seedArr.filter(seed => seed !== id)

      console.log(`removing seed ${id} type ${type}`)


      setSeeds(newSeeds)
      setSelectedSeedsObjs(selectedSeedObjs.filter(obj => obj.id !== id))
   };

   let handleChange = ev => {
      ev.preventDefault()

      if (ev.target.name === 'seedType') {
         // setSearchInput('')
         setSearchRes([])
         setSeedType(ev.target.value)
         if (ev.target.value === 'genre')
            getGenres(data => setSearchRes(data));
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

      if (searchInput && seedType !== 'none') {
         search(query, data => {
            let seedItems;

            // if (seedType === 'track')
               // seedItems = data.map((item, idx) => {
               //    item.desc = `by: ${item.artists.map(artist => artist.name).join(', ')}`
               //    item.imgSrc = item.album.images[0].url
               //    item.onCardClick = addSeed;
               //    item.seedType = 'track'
               //    item.key = idx;
               //    return <SeedResItem {...item}/>;
               // })

            setSearchRes(data)
         })
      }
   };

   // use React.createElement() here
   let mapSearchRes = () => {
      const seedCompMap = {
         'track': SimpleTrack,
         'artist': SimpleArtist,
         'genre': SimpleGenre
      }

      return searchRes.length ?
         searchRes.map((item, idx) => {
            if (seedType === 'genre')
               item = {
                  name: item.split('-').map(genre => genre[0].toUpperCase() + genre.slice(1)).join(' '),
                  id: item,
                  type: 'genre'
               };
            item.onCardClick = addSeed
            return React.createElement(seedCompMap[seedType], {data:item, key:idx})
         })
      : ''
   }

   let mapSelectedSeeds = () => {
      return selectedSeedObjs.length ?
      selectedSeedObjs.map((item, idx) => {
         return <SeedSelectedItem key={idx} type={item.type} id={item.id} name={item.name} imgSrc={item.imgSrc} onCardClick={removeSeed}/>
      })
      : ''
      
   }

   return (
      <div>
         <h1 onClick={() => console.log(`seedType=${seedType}, searchInput=${searchInput}`)}>Seeds</h1>
         <Card>
            {/* <Row>
               <Col onClick={() => console.log(searchRes[0])}>test1</Col>
               <Col onClick={() => console.log(JSON.stringify(seeds, null, 2))}>test2</Col>
               <Col onClick={() => addSeed({id: 1})}>test3</Col>
               <Col onClick={() => console.log(JSON.stringify(selectedSeedObjs, null, 2))}>test2</Col>
            </Row> */}
            <Row>
               {mapSelectedSeeds()}
            </Row>
         </Card>
         <Form onSubmit={submit}>
            <FormGroup>
               <FormControl name='seedType' as='select' onChange={handleChange} value={seedType}>
                  <option value='none'>Select a seed type...</option>
                  <option value='track'>Track</option>
                  <option value='artist'>Artist</option>
                  <option value='genre'>Genre</option>
               </FormControl>
               <FormControl placeholder="search seed" onChange={handleChange} value={searchInput}/>
            </FormGroup>
            <Button onClick={submit} disabled={seedType === 'none' || !searchInput}>Search seed</Button>
         </Form>
         {mapSearchRes()}
      </div>
   )
}