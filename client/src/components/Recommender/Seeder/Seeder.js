import React, { useState, useContext } from 'react';
import { Form, FormGroup, FormControl, Row, Col, Button, Card } from 'react-bootstrap';
import { RecommenderContext } from '../../contexts';
import queryString from 'query-string';
import { search, getGenres } from '../../../api';
import { SimpleTrack, SimpleArtist, SimpleGenre }  from '../../components';

const SeedSelectedItem = props => {
   return (
      <Col>
         <Card style={{cursor: 'pointer'}} onClick={() => props.onCardClick(props.id, props.type)}>
            <img src={props.imgSrc} width='100' height='100'/>
            {props.name}
         </Card>
      </Col>
   );
}

export default function Seeder(props) {
   const [seedType, setSeedType] = useState('none');
   const [searchInput, setSearchInput] = useState('');
   const [searchRes, setSearchRes] = useState([]);
   const [selectedSeedObjs, setSelectedSeedsObjs] = useState([]);

   const [getRecState, setRecState] = useContext(RecommenderContext);

   const addSeed = (targetProps) => {
      const seeds = getRecState('SEEDS');
      const seedArrName = `seed_${targetProps.type}s`;
      const newSeedField = {};
      const newSelectedSeeds = selectedSeedObjs.slice();
      let seedArr = seeds[seedArrName] && seeds[seedArrName].slice();

      if (getRecState('NUM_SEEDS') === 5 || (seedArr && seedArr.indexOf(targetProps.id) !== -1)) return;

      if (seedArr)
         seedArr.push(targetProps.id);
      else
         seedArr = [targetProps.id];

      
      newSeedField[seedArrName] = seedArr;
      newSelectedSeeds.push(targetProps);
      setRecState('SEEDS', {...seeds, ...newSeedField});
      setSelectedSeedsObjs(newSelectedSeeds);
   };

   const removeSeed = (id, type) => {
      const seeds = getRecState('SEEDS');
      const seedArrName = `seed_${type}s`;
      const seedArr = seeds[seedArrName];
      const newSeeds = {...seeds};

      if (seedArr.length === 1)
         delete newSeeds[seedArrName];
      else
         newSeeds[seedArrName] = seedArr.filter(seed => seed !== id);

      setRecState('SEEDS', newSeeds);
      setSelectedSeedsObjs(selectedSeedObjs.filter(obj => obj.id !== id));
   };

   const handleChange = ev => {
      ev.preventDefault()

      if (ev.target.name === 'seedType') {
         setSearchRes([]);
         setSeedType(ev.target.value);
         if (ev.target.value === 'genre')
            getGenres(data => setSearchRes(data));
      }
      else
         setSearchInput(ev.target.value);
   };

   const submit = ev => {      
      let query = queryString.stringify({
         q: searchInput,
         type: seedType
      });

      ev.preventDefault();

      if (searchInput && seedType !== 'none')
         search(query, data => setSearchRes(data));
   };

   const mapSearchRes = () => {
      const seedCompMap = {
         'track': SimpleTrack,
         'artist': SimpleArtist,
         'genre': SimpleGenre
      };

      return searchRes.length
       ? searchRes.map((item, idx) => {
            if (seedType === 'genre')
               item = {
                  name: item.split('-').map(genre => genre[0].toUpperCase() + genre.slice(1)).join(' '),
                  id: item,
                  type: 'genre'
               };
            item.onCardClick = addSeed
            return React.createElement(seedCompMap[seedType], {data:item, key:idx})
         })
       : '';
   }

   const mapSelectedSeeds = () => {
      return selectedSeedObjs.length
       ? selectedSeedObjs.map((item, idx) => {
         return <SeedSelectedItem key={idx} type={item.type} id={item.id} name={item.name} imgSrc={item.imgSrc} onCardClick={removeSeed}/>
         })
       : '';
   }

   return (
      <div>
         <h1>Seeds</h1>
         <Card>
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