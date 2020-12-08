import React from 'react';
import { Card } from 'react-bootstrap';

export default props => {
   const data = props.data;

   return (
      <div>
         <Card style={{cursor: 'pointer'}} onClick={
          data.onCardClick ? () => data.onCardClick(data) : () => {}}>
            <img src={data.imgSrc} width='200' height='200'/>
            <Card.Body>
               {data.name}
            </Card.Body>
         </Card>
      </div>
   );
}