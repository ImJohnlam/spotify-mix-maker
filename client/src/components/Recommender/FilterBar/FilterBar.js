import React, {useEffect, useState, Component, useContext} from 'react';
import {Form, FormGroup, FormControl, Row, Col, Button, Card, Collapse, Container} from 'react-bootstrap';
import { RecommenderContext } from '../../contexts'

const attributes = ['acousticness', 'tempo', 'danceability', 'duration_ms',
 'energy', 'valence', 'instrumentalness', 'key',
 'liveness','loudness', 'popularity', 'speechiness'];

const attrFriendlyNames = {
   'acousticness': 'Acousticness',
   'danceability': 'Danceability',
   'duration_ms': 'Duration',
   'energy': 'Energy',
   'instrumentalness': 'Instrumentalness',
   'key': 'Key',
   'liveness': 'Liveness',
   'loudness': 'Loudness',
   'mode': 'Mode',
   'popularity': 'Popularity',
   'speechiness': 'Speechiness',
   'tempo': 'BPM',
   'valence': 'Happiness'
};


const AttributeSetting = props => {
   const friendlyName = attrFriendlyNames[props.attr]
   let controls;

   const [localFilters, setLocalFilters] = useState({})
   const [borderState, setBorderState] = useState(false)
   const [seeds, setSeeds, calcNumSeeds, filters, setFilters] = useContext(RecommenderContext)

   let applyFilters = ev => {
      let newFilters;

      if (!Object.keys(localFilters).length)
         return;

      if (props.attr === 'duration_ms') {
         Object.keys(localFilters).forEach(filterName =>
            localFilters[filterName] = localFilters[filterName].split(':').reduce((acc,time) => (60 * acc) + +time) * 1000
         )
      }

      newFilters = {...filters, ...localFilters};
      setFilters(newFilters);
      setBorderState('success')
   }

   let resetFilters = ev => {
      let newFilters = {...filters}
      delete newFilters[`target_${props.attr}`]
      delete newFilters[`min_${props.attr}`]
      delete newFilters[`max_${props.attr}`]
      
      setLocalFilters({})
      setFilters(newFilters)
      setBorderState('')
   }

   let handleChange = ev => {
      let newFilters = {...localFilters}
      ev.preventDefault()

      newFilters[ev.target.name] = ev.target.value;
      setLocalFilters(newFilters)
      setBorderState('warning')
   }

   if (props.attr === 'key')
      controls = (
         <section className='container'>
         <Row>
            <Col>
               <Form.Control name='target_key' as='select' onChange={handleChange} value={localFilters.target_key || ''}>
                  <option value=''>Key</option>
                  <option value='0'>C</option>
                  <option value='1'>C#</option>
                  <option value='2'>D</option>
                  <option value='3'>D♯</option>
                  <option value='4'>E</option>
                  <option value='5'>F</option>
                  <option value='6'>F♯</option>
                  <option value='7'>G</option>
                  <option value='8'>G♯</option>
                  <option value='9'>A</option>
                  <option value='10'>A♯</option>
                  <option value='11'>B</option>
               </Form.Control>
            </Col>
            <Col>
               <Form.Control name='target_mode' as='select' onChange={handleChange} value={localFilters.target_mode || ''}>
                  <option value=''>Tonality</option>
                  <option value='0'>Minor</option>
                  <option value='1'>Major</option>
               </Form.Control>
            </Col>
            <Col>
               <Button onClick={applyFilters}>apply</Button>
               <Button onClick={resetFilters}>reset</Button>
            </Col>
         </Row>
         </section>
      );
   else
      controls = (
         <section className='container'>
         <Row style={{margin:'10px 10px 10px 10px'}}>
               <Row>
               <Form.Control name={`target_${props.attr}`} placeholder='target' 
               onChange={handleChange} value={localFilters[`target_${props.attr}`] || ''}/>
               </Row>
            
               <Row>
               <Form.Control name={`min_${props.attr}`} placeholder='min' 
               onChange={handleChange} value={localFilters[`min_${props.attr}`] || ''}/>
               </Row>
         
               <Row>
               <Form.Control name={`max_${props.attr}`} placeholder='max' 
               onChange={handleChange} value={localFilters[`max_${props.attr}`] || ''}/>
               </Row>

            <div>
               <Button onClick={applyFilters}>apply</Button>
               <Button onClick={resetFilters}>reset</Button>
               </div>
         </Row>
         </section>
      );

   return (
      <Card border={borderState} style={{margin:'10px 10px 10px 10px'}}>
         <Card.Body onClick={() => console.log(JSON.stringify(filters, null, 2))}>{friendlyName}</Card.Body>
         <Form>
            {controls}
         </Form>
      </Card>
   );
}

//TODO: tooltips for loudness, duration, key(?)
export default function FilterBar(props) {
   const attrPerRow = 4;
   const [open, setOpen] = useState(false);
   let attrGrid = [];

   for (let i = 0; i < attributes.length; i += attrPerRow) {
      attrGrid.push(
         <Row key={Math.floor(i, attrPerRow)}>
            {attributes.slice(i, i + attrPerRow).map((attribute, idx) => 
            <Col key={idx}>
               <AttributeSetting attr={attribute} key={idx}/>
            </Col>)}
         </Row>
      );
   }

   return (
      <div>
         <Button onClick={() => setOpen(!open)}>Filters</Button>
         <Collapse in={open}>
            <div>{attrGrid}</div>
         </Collapse>
      </div>
   );
}