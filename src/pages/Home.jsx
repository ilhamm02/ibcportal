import React from 'react';
import '../assets/styles.css';
import Summary from '../components/Summary';
import Transactions from '../components/Transactions';
import Tokens from '../components/Tokens';

class Home extends React.Component {
  componentDidMount() {
    document.title = `IBC Gang | Decentralized Cosmos-SDK IBC Protocol Data Display`;
  }

  render(){
    return (
      <>
      <Summary />
      <div className="init-container no-margin">
        <div className="row">
          <div className="col-md-6">
            <h5>Channels</h5>
            <Tokens />
          </div>
          <div className="col-md-6">
            <h5>Transactions</h5>
            <Transactions />
          </div>
        </div>
      </div>
      </>
    )
  }
}

export default Home;