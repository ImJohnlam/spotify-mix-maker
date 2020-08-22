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

   const [recSettings, setRecSettings] = useContext(RecommenderContext);

   let handleChange = ev => {
      
   }

   //add check box to (de)activate
   if (props.attr === 'key')
      controls = <Button>key</Button>
   else {
      controls = (
         <Form>
            <Row>
               <Col>
                  <Form.Control placeholder='target'></Form.Control>
               </Col>
               <Col>
                  <Form.Control placeholder='min'></Form.Control>
               </Col>
               <Col>
                  <Form.Control placeholder='max'></Form.Control>
               </Col>
               <Col>
                  <Form.Check type='checkbox' label='apply' onChange={() => console.log(recSettings)}/>
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