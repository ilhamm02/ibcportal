import React from 'react';
import { connect } from 'react-redux';
import '../assets/styles.css';
import { getSummary } from  '../redux/actions/getData';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

class Summary extends React.Component {
  state={}
  componentDidMount(){
    this.props.getSummary(cookies.get("node").end);
  }

  render(){
    return (
      <>
      {
        this.state.message ?
          <div className="error-fetch bg-danger">
            <p className="closing-p">{this.state.message}</p>
          </div>
        : null
      }
      <h5>Overview</h5>
      <div className="my-container summary mb-3" data-theme="dark">
        <div className="row">
          <div className="column col-md-3 col-6">
            <p><i className="bi bi-boxes"></i> Block</p>
            <h4>{parseInt(this.props.fullData.height).toLocaleString()}</h4>
          </div>
          <div className="column col-md-3 col-6">
            <p><i className="bi bi-arrow-down-up"></i> Total Transfer</p>
            <h4>{parseInt(this.props.fullData.txs).toLocaleString()}</h4>
          </div>
          <div className="column col-md-3 col-6">
            <p><i className="bi bi-bezier2"></i> Total Channel</p>
            <h4>{parseInt(this.props.fullData.channel).toLocaleString()}</h4>
          </div>
          <div className="column col-md-3 col-6">
            <p><i className="bi bi-coin"></i> Total Token</p>
            <h4>{parseInt(this.props.fullData.tokens).toLocaleString()}</h4>
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

const mapDispatchToProps = {
  getSummary
}

export default connect(mapStateToProps, mapDispatchToProps)(Summary);