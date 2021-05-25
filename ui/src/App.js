import './App.css';
import { BrowserRouter as Router, Route} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from "./components/navbar/navbar.component";
import Home from "./components/home/home.component";
import Detect from "./components/detect/detect.component";
import Gallery from "./components/gallery/gallery.component";

function App() {
  return (
    <Router>
      <Navbar></Navbar>
      <Route path="/" exact component={Home}></Route>
      <Route path="/detect" exact component={Detect}></Route>
      <Route path="/gallery" exact component={Gallery}></Route>
    </Router>
  );
}

export default App;
