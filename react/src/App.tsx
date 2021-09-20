import { connect } from 'react-redux';
import Auth from './components/Authentication';
import './App.css';

const App = (): JSX.Element => {
  return <Auth />;
};

export default connect()(App);