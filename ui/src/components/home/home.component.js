import React, { Component } from 'react';
import { Button } from 'reactstrap';
import bgImage from '../../assets/bg_image.png'; 
import './home.component.css'

export default class Navbar extends Component {

  render() {
 
    return (
      <div className="homeBody">
        <img className="bgImage" src={bgImage}/>
        <div className="buttonContainer">
          <Button href="/detect" className="detectButton" color="primary">Detect Objects</Button>{' '}
        </div>
      </div>
    );
  }
}