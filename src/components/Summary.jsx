import React from 'react';
import Axios from 'axios';
import {apiURL} from "../data/API";
import '../assets/styles.css';

class Summary extends React.Component {
  state={
    height: 0,
    txs: 0,
    channel: 0,
    tokens: 0,
    denom: '-',
    loopSum: false
  }
  componentDidMount(){
    this.getData()
    setInterval(() => {
      if(this.state.loopSum) {
        this.setState({loopSum: false});
        this.getData()
      }
    }, 20000);
  }

  getData() {
    var rpc;
    if(localStorage.getItem("node")){
      rpc = JSON.parse(localStorage.getItem("node")).end;
    }else{
      localStorage.setItem("node", JSON.stringify({end: "localhost:1315", dec: 6}))
      localStorage.setItem("nodes", JSON.stringify([{node: "localhost:1316", dec: 6, name: "Persistence"},{node: "localhost:1311", dec: 6, name: "Comdex"}, {node: "localhost:1315", dec: 6, name: "Ki Chain"}]))
      rpc = JSON.parse(localStorage.getItem("node")).end;
    }
    Axios.get(`${apiURL}/status?rpc=${rpc}`)
    .then(res => {
      this.setState({
        height: res.data.data.height,
        txs: res.data.data.txs,
        channel: res.data.data.channel,
        tokens: res.data.data.tokens,
        denom: res.data.data.denom,
        chainId: res.data.data.chainId,
        loopSum: true
      })
    })
    .catch(err => {
      this.setState({
        loopSum: true
      })
      console.error(err)
    })
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
      <div className="init-container">
        <h5>Overview <span className="text-muted small-text">{this.state.chainId}</span></h5>
        <div className="my-container summary">
          <div className="row">
            <div className="column col-md-3 col-6">
              <p><i className="bi bi-boxes"></i> Block</p>
              <h4>{parseInt(this.state.height).toLocaleString()}</h4>
            </div>
            <div className="column col-md-3 col-6">
              <p><i className="bi bi-arrow-down-up"></i> Total Transfer</p>
              <h4>{parseInt(this.state.txs).toLocaleString()}</h4>
            </div>
            <div className="column col-md-3 col-6">
              <p><i className="bi bi-bezier2"></i> Total Channel</p>
              <h4>{parseInt(this.state.channel).toLocaleString()}</h4>
            </div>
            <div className="column col-md-3 col-6">
              <p><i className="bi bi-info-circle"></i> Total Token</p>
              <h4>{parseInt(this.state.tokens).toLocaleString()}</h4>
            </div>
          </div>
        </div>
      </div>
      </>
    )
  }
}

export default Summary;