import React, {useEffect, useState, Component, useContext} from 'react';
import {Form, FormGroup, FormControl, Row, Col, Button, Card} from 'react-bootstrap';
import { RecommenderContext } from '../../contexts'

const attributes = ['acousticness', 'danceability', 'duration_ms', 'energy', 
 'valence', 'instrumentalness', 'key', 'liveness',
 'loudness', 'popularity', 'speechiness', 'tempo']

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
   'tempo': 'Tempo',
   'valence': 'Happiness'
}


const AttributeSetting = props => {
   const friendlyName = attrFriendlyNames[props.attr]
   let controls;

   const [localFilters, setLocalFilters] = useState({})
   const [checked, setChecked] = useState(false)
   const [recSettings, setRecSettings] = useContext(RecommenderContext);

   let handleCheck = ev => {
      let newRecSettings = Object.assign({}, recSettings)
      let newRecFilters;
      if (ev.target.value === 'false')
         newRecFilters = {...recSettings.filters, ...localFilters}
      else {
         newRecFilters = {...recSettings.filters}
         delete newRecFilters[`target_${props.attr}`]
         delete newRecFilters[`min_${props.attr}`]
         delete newRecFilters[`max_${props.attr}`]
      }

      console.log('checkbox')
      console.log(`recSettings=${JSON.stringify(recSettings, null, 2)}`)
      console.log(`localFilters=${JSON.stringify(localFilters, null, 2)}`)
      console.log(`newRecFilters=${JSON.stringify(newRecFilters, null, 2)}`)
      console.log(`newRecSettings=${JSON.stringify(newRecSettings, null, 2)}`)
      setChecked(!checked)
      setRecSettings({...newRecSettings, filters: {...newRecFilters}})
   }

   let handleChange = ev => {
      let newFilters = {...localFilters}
      ev.preventDefault()

      // convert to ms
      if (props.attr === 'duration_ms')
         console.log()

      else {
         newFilters[`${ev.target.placeholder}_${props.attr}`] = ev.target.value;
         setLocalFilters(newFilters)
      }
         
   }

   //add check box to (de)activate
   if (props.attr === 'key')
      controls = <Button>key</Button>
   else {
      controls = (
         <Form>
            <Row>
               <Col>
                  <Form.Control placeholder='target' onChange={handleChange}></Form.Control>
               </Col>
               <Col>
                  <Form.Control placeholder='min' onChange={handleChange}></Form.Control>
               </Col>
               <Col>
                  <Form.Control placeholder='max' onChange={handleChange}></Form.Control>
               </Col>
               <Col>
                  <Form.Check type='checkbox' label='apply' value={checked} onChange={handleCheck}/>
               </Col>
            </Row>
         </Form>
      )
   }

   return (
      <Card>
         <Card.Body>{friendlyName}</Card.Body>
         {controls}
      </Card>
   )
}

export default function FilterBar(props) {
   const attrPerRow = 4;
   let attrGrid = [];

   for (let i = 0; i < attributes.length; i += attrPerRow) {
      attrGrid.push(
         <Row key={Math.floor(i, attrPerRow)}>
            {attributes.slice(i, i + attrPerRow).map((attribute, idx) => 
            <Col key={idx}>
               <AttributeSetting attr={attribute} key={idx}/>
            </Col>)}
         </Row>
      )
   }

   return (
      <div>
         {attrGrid}
      </div>
   )
}