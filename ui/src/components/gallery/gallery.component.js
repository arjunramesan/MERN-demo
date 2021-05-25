import React, { Component } from 'react';
import loader from '../../assets/loader.gif';
import './gallery.component.css';

export default class Navbar extends Component {

  constructor(props){
    super(props)
    this.state = {
      loaded: false,
      content: []
    }
    this.getAllImages();
  }


  getAllImages(){
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    };
    fetch('http://localhost:5000/inputs/', requestOptions)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        this.setState({
          loaded: true,
          content: data
        })
      });
  }

  getDate(dateStr){
    var time = new Date(dateStr).getHours() + ":" + new Date(dateStr).getMinutes();
    var date = new Date(dateStr).getDate() + "/" + (new Date(dateStr).getMonth()+1) + "/" + new Date(dateStr).getFullYear();
    return time + " " + date;
  }

  render() {
    return (
      <div className="container pt-4">
        <div className="row">
          <div className="col-md-12">
            <h3><b>Gallery</b></h3>
            <br></br>
            {this.state.loaded==false && <span>Loading... <img className="loader" src={loader}></img></span>}
          </div>
        </div>

        {this.state.content.map((el,index) =>
        <div className="row mb-4 galleryTile bg-light">
          <div className="col-md-5">
            <div className="resultDiv">
              <img className="resultThumbnail" src={"data:image/png;base64, " + el.image}/>
              {el.detections[0].Instances.map((el2,index2) => 
                      <div className="boundingBox" key={index2} style={{top: (el2.BoundingBox.Top*100) + '%', left: (el2.BoundingBox.Left*100) + '%', height: (el2.BoundingBox.Height*100) + '%', width: (el2.BoundingBox.Width*100) + '%'}}><span className="boundingBoxLabel">{el.detections[0].Name}</span></div>
              )}
            </div>
          </div>
          <div className="col-md-5">
            <b>{el.description}</b>
            <br></br>
           
            <br></br>
            <div><b>Objects detected : </b> {el.detections.map((detects)=><span>{detects.Name}, </span>)}</div>
          </div>
          <div className="col-md-2">
            <span>Added by {el.username} on {this.getDate(el.createdAt)}</span>
          </div>
        </div>
        )}
      </div>
    );
  }
}