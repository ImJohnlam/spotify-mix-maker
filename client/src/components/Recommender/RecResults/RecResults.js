import React, {useEffect, useState, Component, useContext} from 'react';
import {Form, FormGroup, FormControl, Row, Col, Button, Card} from 'react-bootstrap';
import { RecommenderContext } from '../../contexts'
import queryString from 'query-string';
import { getRecommendations } from '../../../api'
import { SimpleTrack }  from '../../components'


export default function RecResults(props) {
   const [recs, setRecs] = useState([])
   const [sortField, setSortField] = useState('')
   const [seeds, setSeeds, filters, setFilters, calcNumSeeds] = useContext(RecommenderContext);

   let submit = ev => {
      let seedStrs = {...seeds};
      let query;
      
      Object.keys(seedStrs).forEach(seedKey => seedStrs[seedKey] = seedStrs[seedKey].join(','))
      query = queryString.stringify({...seedStrs, ...filters})
      console.log(query)
      getRecommendations(query, tracks => setRecs(tracks))

   }

   let mapReccomendations = () => {
      return recs.map(rec => <SimpleTrack data={rec}/>)
   }

   // TODO: sort
   return (
      <div>
         <p onClick={() => {console.log(JSON.stringify(recs, null, 2)); console.log(`# recomends = ${recs.length}`)}}>test</p>
         <b>RESULTS HERE</b>
         <Button onClick={submit} disabled={!calcNumSeeds()}>Get Reccommendations</Button>
         {mapReccomendations()}


      </div>
   )
}