import React, {useEffect, useContext } from 'react';
import { Button, Card, ListGroup } from 'react-bootstrap';

export default props => {
   let data = props.data;

   let temp = () => {}

   return (
      <div>
         <Card style={{cursor: 'pointer'}} onClick={
          data.onCardClick ? () => data.onCardClick(data) : temp}>
            <img src={undefined} width='200' height='200'/>
            <Card.Body>
               {data.name}
            </Card.Body>
         </Card>
      </div>
   )
}