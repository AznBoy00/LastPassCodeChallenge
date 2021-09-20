import { connect } from 'react-redux';
import { RootState } from './reducers/rootReducer';
import Authentication from './components/Authentication';
import logo from './logo.svg';
import './App.css';
import PrivateInfo from './components/PrivateInfo';

interface Props {
  username: string;
}

const App = ({ username}: Props): JSX.Element => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>

      {username ? <PrivateInfo /> : <Authentication />}
    </div>
  )
};

const mapStateToProps = (state: RootState): Props => ({
  username: state.auth.username,
});

export default connect(mapStateToProps)(App);