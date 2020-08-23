import React, {useEffect, useState, Component, useContext} from 'react';
import {Form, FormGroup, FormControl, Row, Col, Button, Card} from 'react-bootstrap';
import queryString from 'query-string';
import {FilterBar} from '../components'
import { RecommenderContext, RecommenderContextProvider } from '../contexts'

export default function Recommender(props) {

   return (
      <section className='container'>
         <h1>--Recommender--</h1>
         
         <RecommenderContextProvider>
            <Button onClick={() => console.log(0)}>test button</Button>
            <FilterBar/>
            <Row>
               <Col>
                  <b>seeder here</b>
               </Col>
               <Col>
                  <b>results here</b>
               </Col>
            </Row>
         </RecommenderContextProvider>
         
      </section>
   )
}