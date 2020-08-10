import React, {useEffect, useState, Component} from 'react';
import {Form, FormGroup, FormControl, Row, Col, Button} from 'react-bootstrap';
import queryString from 'query-string';

const AttributeSetting = props => {

}

export default function Recommender(props) {
   const [recs, setRecs] = useState([]);

   let seeds = {
      seed_artists: [],
      seed_genres: [],
      seed_tracks: []
   };
   let filters = {};

   let submit = () => {
      fetch()
   }

   return (
      <div>
         <h1>--Recommender--</h1>
      </div>
   )
}