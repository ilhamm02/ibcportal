import React from 'react';
import '../assets/styles.css';
import Summary from '../components/Summary';
import Transactions from '../components/Transactions';
import Tokens from '../components/Tokens';
import { connect } from 'react-redux';

class Home extends React.Component {
  componentDidMount() {
    document.title = `IBC Scan | Decentralized Cosmos-SDK IBC Protocol Data Display`;
  }

  render(){
    return (
      <>
      <div className="thecontainer" data-theme={this.props.fullData.theme}>
        <Summary />
        <div className="row">
          <div className="col-md-6 mb-3">
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

const mapStateToProps = (state) => {
  return {
    fullData: state.user
  }
};

export default connect(mapStateToProps)(Home);