import React, { Component } from 'react';
import { Button } from 'reactstrap';
import './detect.component.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import loader from '../../assets/loader.gif';
import AWS from 'aws-sdk';


export default class Navbar extends Component {

  
  constructor(props){
    super(props)
    this.state = {
      file: null,
      thumbnail: null,
      step: 1,
      loading: false,
      saving: false,
      boxes: [],
      detections: [],
      name: '',
      description: '',
      imageBase64: null
    }
    this.handleChange = this.handleChange.bind(this);
    this.detect = this.detect.bind(this);
    this.getBufferArray = this.getBufferArray.bind(this);
    this.nameChanged = this.nameChanged.bind(this);
    this.descriptionChanged = this.descriptionChanged.bind(this);
    this.exit = this.exit.bind(this);
    this.save = this.save.bind(this);
    AWS.config.update({
      region: 'us-east-1',
      credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'us-east-1:bee17cd9-1d1e-455a-b028-2b9ed7334342'
      })
    });

    this.rekognition = new AWS.Rekognition();
  }


  handleChange(event) {
    if(event.target.files[0]){
      console.log()
      this.setState({
        file: event.target.files[0],
        step: 2,
        thumbnail: URL.createObjectURL(event.target.files[0]),
      })
    }
  }

  getBufferArray(){
    console.log('Loading image...');
    var file = this.state.file;
    var that = this;
    var reader = new FileReader();
    var base64String = '';
    reader.onloadend = function(){
      base64String = reader.result.split(',')[1];
      var binary_string = window.atob(base64String);
      var len = binary_string.length;
      var bytes = new Uint8Array(len);
      for (var i = 0; i < len; i++) {
          bytes[i] = binary_string.charCodeAt(i);
      }
      that.setState({
        imageBase64: base64String
      })
      that.detect(bytes.buffer);
    }
    reader.readAsDataURL(file);
  }

  detect(byteArray){
    console.log('Detecting...')
    var that = this;
    this.setState({
      loading: true,
      step: 2
    });

   

    let formData = new FormData();
    formData.append("image", this.state.file);

    console.log(this.state.file);

    // Flask API //
    const requestOptions = {
      method: 'POST',
      mode: 'cors',
      body: formData
    };
    fetch('http://localhost:5000/flaskapi', requestOptions)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        that.setState({
        loading: false,
        step: 3,
        boxes: data.Labels[0].Instances,
        detections: data.Labels
      });
    });


    // AWS JavaScript SDK //

    // const params = {
    //   Image: { /* required */
    //     Bytes: Buffer.from(byteArray) /* Strings will be Base-64 encoded on your behalf */,
    //   },
    // };
    // this.rekognition.detectLabels(params, function(err, data) {
    //   if (err){
    //     console.log(err, err.stack); // an error occurred
    //     that.setState({
    //       loading: false,
    //     });
    //   }
    //   else{
    //     console.log(data);           // successful response
    //     that.setState({
    //       loading: false,
    //       step: 3,
    //       boxes: data.Labels[0].Instances,
    //       detections: data.Labels
    //     });
    //   }
    // });
  }

  nameChanged(event){
    this.setState({name: event.target.value});
  }

  descriptionChanged(event){
    this.setState({description: event.target.value});
  }

  exit(){
    this.setState({step: 0, thumbnail: null, file: null, saving: false});
  }

  save(){
    const dataToSend = {
      username: this.state.name,
      description: this.state.description,
      detections: this.state.detections,
      image: this.state.imageBase64
    }

    console.log(dataToSend);
    this.setState({
      saving: true
    })

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataToSend)
    };
    fetch('http://localhost:5001/inputs/add', requestOptions)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        toast.success("Added to gallery!");
        this.exit();
      });

  }

  render() {
    return (
          <div className="container pt-4">
            <div className="row">
              <div className="col-md-2">
                <h3><b>Step 1.</b></h3>
              </div>
              <div className="col-md-10">
                <h3>Upload an image</h3>
                <input type="file" onChange={this.handleChange}></input>
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-md-2">
              </div>
              <div className="col-md-10">
                {this.state.file && <img className="inputThumbnail" src={this.state.thumbnail}/>}
              </div>
            </div>

            {this.state.step>1 &&
              <div className="row mt-4">
                <div className="col-md-2">
                  <h3><b>Step 2.</b></h3>
                </div>
                <div className="col-md-10">
                  <h3>Detect objects</h3>
                  {this.state.loading==false && <Button onClick={this.getBufferArray} className="detectButton" color="primary">Detect</Button>}
                  {this.state.loading==true && <span>Processing... <img className="loader" src={loader}></img></span>}
                </div>
              </div>
            }

            {this.state.step>2 &&
              <div className="row mt-4">
                <div className="col-md-2">
                  <h3><b>Step 3.</b></h3>
                </div>
                <div className="col-md-10">
                  <h3>Result</h3>
                  <div className="resultDiv">
                    <img className="resultThumbnail" src={this.state.thumbnail}/>
                    {this.state.boxes.map((el,index) => 
                      <div className="boundingBox" key={index} style={{top: (el.BoundingBox.Top*100) + '%', left: (el.BoundingBox.Left*100) + '%', height: (el.BoundingBox.Height*100) + '%', width: (el.BoundingBox.Width*100) + '%'}}><span className="boundingBoxLabel">{this.state.detections[0].Name}</span></div>
                    )}
                  </div>
                  <br></br>
                  <b>Other objects detected : </b><br></br>
                    {this.state.detections.map((el,index) => 
                      <span key={index}>{el.Name}, </span>
                    )}
                </div>
              </div>
            }

            {this.state.step>2 &&
              <div className="row mt-4">
                <div className="col-md-2">
                  <h3><b>Step 4.</b></h3>
                </div>
                <div className="col-md-10">
                  <h3>Save to gallery</h3>
                  <div className="row">
                      <div className="col-md-3">
                        <label>Your name : </label>
                      </div>
                      <div className="col-md-5">
                        <input type="text" className="form-control" placeholder="Enter your name" onChange={this.nameChanged}></input>
                      </div>
                  </div>
                  <div className="row mt-2">
                      <div className="col-md-3">
                        <label>Description : </label>
                      </div>
                      <div className="col-md-5">
                        <textarea rows="5" className="form-control" placeholder="Enter description for the image" onChange={this.descriptionChanged}></textarea>
                      </div>
                  </div>
                  <div className="row mt-2 mb-4">
                  {this.state.saving == false && <div className="col-md-8">
                        <Button style={{float:'right',marginLeft:'0.8rem'}} color="primary" onClick={this.save} >Save</Button>
                        <Button style={{float:'right'}} color="danger" onClick={this.exit} >Exit</Button>
                      </div>
                  }
                  {this.state.saving == true && <div className="col-md-8">
                    <span style={{float: 'right' }}>Saving... <img className="loader" src={loader}></img></span>
                    </div>
                  }
                  </div>
                </div>
              </div>
            }
          <ToastContainer
            position="bottom-center"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          </div>
     
    );
  }
}