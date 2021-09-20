import { connect } from 'react-redux';
import { RootState } from './reducers/rootReducer';
import Authentication from './components/Authentication';
import logo from './logo.svg';
import './App.css';
import PrivateInfo from './components/PrivateInfo';

interface Props {
  username: string;
  authToken: string;
}

const App = ({ username, authToken}: Props): JSX.Element => { 
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>

      {username && authToken ? <PrivateInfo /> : <Authentication />}
    </div>
  )
};

const mapStateToProps = (state: RootState): Props => ({
  username: state.auth.username,
  authToken: state.auth.authToken,
});

export default connect(mapStateToProps)(App);