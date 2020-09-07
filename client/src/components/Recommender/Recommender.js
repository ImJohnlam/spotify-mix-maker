import React, {useEffect, useState, Component, useContext} from 'react';
import {Form, FormGroup, FormControl, Row, Col, Button, Card} from 'react-bootstrap';
import queryString from 'query-string';
import {FilterBar, Seeder, RecResults, PlaylistTracker} from '../components'
import { RecommenderContext, RecommenderContextProvider } from '../contexts'

export default function Recommender(props) {

   return (
      <section className='container'>
         <h1>--Recommender--</h1>
         <p>instructions here</p>
         <RecommenderContextProvider>
            <FilterBar/>
            <Row>
               <Col>
                  <Seeder/>
               </Col>
               <Col>
                  <RecResults/>
               </Col>
               <Col>
                  <PlaylistTracker/>
               </Col>
            </Row>
         </RecommenderContextProvider>
         
      </section>
   )
}