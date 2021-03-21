import './App.css';
import NavBar from './Components/NavBar/NavBar';
import Main from './Components/Main/Main';
import {User} from './Components/User/User';
import Footer from './Components/Footer/Footer';
import DashBoard from './Components/DashBoard/DashBoard';
import {BrowserRouter as Router,Route,Switch} from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Router>
        
        <Switch>
          <Route exact path="/">
            <NavBar/>
            <Main/>
            <Footer/>
          </Route>
          <Route exact path="/dashboard">
          <DashBoard/>
          <Footer/>
          </Route>
          <Route exact path='/user/:id'>
          
            <User/>
            <Footer/>
          </Route>
         
        </Switch>
      </Router>
    </div>
  );
}

export default App;
