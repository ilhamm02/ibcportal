import React from 'react';
import {Link} from 'react-router-dom';
import '../assets/styles.css';
import Summary from "../components/Summary";
import Axios from 'axios';
import {apiURL, projectName} from '../data/API'

class Channel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      checkTxIn: false,
      checkTxOut: false,
      dec: localStorage.getItem("node") ? JSON.parse(localStorage.getItem("node")).dec : 6,
      pageIn: 1,
      pageOut: 1,
      totalIn: 0,
      totalOut: 0,
    }

    this.increasePageIn = this.increasePageIn.bind(this);
    this.decreasePageIn = this.decreasePageIn.bind(this);
    this.increasePageOut = this.increasePageOut.bind(this);
    this.decreasePageOut = this.decreasePageOut.bind(this);
  }
  componentDidMount() {
    document.title = `Channel channel-${this.props.match.params.from} & channel-${this.props.match.params.to} | ${projectName}`;
    this.getTxsIn();
    this.getTxsOut();
    this.getTokens();
    this.getStatus();
  }

  getStatus(){
    var rpc;
    if(localStorage.getItem("node")){
      rpc = JSON.parse(localStorage.getItem("node")).end;
    }else{
      localStorage.setItem("node", {"end": "localhost:1315", "dec": 6})
      localStorage.setItem("nodes", JSON.stringify([{node: "localhost:1316", dec: 6, name: "Persistence"},{node: "localhost:1311", dec: 6, name: "Comdex"}, {node: "localhost:1315", dec: 6, name: "Ki Chain"}]))
      rpc = JSON.parse(localStorage.getItem("node")).end;
    }
    Axios.get(`${apiURL}/ibc/channels?rpc=${rpc}`)
    .then(res => {
      var status = "NOT_FOUND"; 
      status = res.data.data.map(ch => {
        if(ch.from === `channel-${this.props.match.params.from}` && ch.to === `channel-${this.props.match.params.to}`){
          return ch.status
        }
      })
      this.setState({
        status
      })
    })
  }
  getTokens(){
    var rpc;
    if(localStorage.getItem("node")){
      rpc = JSON.parse(localStorage.getItem("node")).end;
    }else{
      localStorage.setItem("node", {"end": "localhost:1315", "dec": 6})
      localStorage.setItem("nodes", JSON.stringify([{node: "localhost:1316", dec: 6, name: "Persistence"},{node: "localhost:1311", dec: 6, name: "Comdex"}, {node: "localhost:1315", dec: 6, name: "Ki Chain"}]))
      rpc = JSON.parse(localStorage.getItem("node")).end;
    }
    Axios.get(`${apiURL}/ibc/tokens/list?rpc=${rpc}`)
    .then(res => {
      const denom = res.data.data.filter(tk => {
        return tk.channel === `channel-${this.props.match.params.from}`
      })
      this.setState({
        denom
      })
    })
  }
  getTxsOut(page){
    if(!page){
      page = this.state.pageOut
    }
    var rpc;
    if(localStorage.getItem("node")){
      rpc = JSON.parse(localStorage.getItem("node")).end;
    }else{
      localStorage.setItem("node", {"end": "localhost:1315", "dec": 6})
      localStorage.setItem("nodes", JSON.stringify([{node: "localhost:1316", dec: 6, name: "Persistence"},{node: "localhost:1311", dec: 6, name: "Comdex"}, {node: "localhost:1315", dec: 6, name: "Ki Chain"}]))
      rpc = JSON.parse(localStorage.getItem("node")).end;
    }
    Axios.get(`${apiURL}/txs/list?fromChannel=channel-${this.props.match.params.from}&toChannel=channel-${this.props.match.params.to}&type=out&rpc=${rpc}&page=${page}`)
    .then(res => {
      this.setState({
        txsOut: res.data.data,
        totalOut: res.data.total,
        checkTxOut: true,
      })
    })
    .catch(err => {
      console.error(err)
    })
  }
  getTxsIn(page){
    if(!page){
      page = this.state.pageIn
    }
    var rpc;
    if(localStorage.getItem("node")){
      rpc = JSON.parse(localStorage.getItem("node")).end;
    }else{
      localStorage.setItem("node", {"end": "localhost:1315", "dec": 6})
      localStorage.setItem("nodes", JSON.stringify([{node: "localhost:1316", dec: 6, name: "Persistence"},{node: "localhost:1311", dec: 6, name: "Comdex"}, {node: "localhost:1315", dec: 6, name: "Ki Chain"}]))
      rpc = JSON.parse(localStorage.getItem("node")).end;
    }
    Axios.get(`${apiURL}/txs/list?fromChannel=channel-${this.props.match.params.from}&toChannel=channel-${this.props.match.params.to}&type=in&rpc=${rpc}&page=${page}`)
    .then(res => {
      this.setState({
        txsIn: res.data.data,
        totalIn: res.data.total,
        checkTxIn: true,
      })
    })
    .catch(err => {
      console.error(err)
    })
  }

  increasePageIn(){
    this.setState({
      pageIn: this.state.pageIn + 1
    })
    this.getTxsIn(this.state.pageIn + 1)
  }
  decreasePageIn(){
    this.setState({
      pageIn: this.state.pageIn - 1
    })
    this.getTxsIn(this.state.pageIn - 1)
  }
  increasePageOut(){
    this.setState({
      pageOut: this.state.pageOut + 1
    })
    this.getTxsOut(this.state.pageOut + 1)
  }
  decreasePageOut(){
    this.setState({
      pageOut: this.state.pageOut - 1
    })
    this.getTxsOut(this.state.pageOut - 1)
  }

  loopTxsIn(){
    const dateNow = new Date();
    return this.state.txsIn.map(tx => {
      var txDate = parseInt((dateNow-tx.txTime)/1000);
      if (txDate > 86400){
        txDate = parseInt(txDate/86400)+"d";
        if(parseInt(txDate) > 30){
          txDate = parseInt(txDate/30)+"m"
        }else if(parseInt(txDate) > 7){
          txDate = parseInt(txDate/7)+"w"
        }
      }else if(txDate > 3600){
        txDate = parseInt(txDate/3600)+"h";
      }else if(txDate > 60){
        txDate = parseInt(txDate/60)+"m";
      }else{
        txDate = txDate+"s"
      }
      return(
        <Link to={`/tx/${tx.txHash}`}>
          <div className="my-container transaction-list">
            <div className="row">
              <div className="col-md-9 col-8">
                <p className="text-hash"><i className="bi bi-check-all"></i> {tx.txHash}</p>
              </div>
              <div className="col-md-3 col-4">
                <p className="text-hash text-second"><span className="stopwatch">{txDate} </span> <span style={{"display": "none"}} className="timestampSaver">{parseInt(tx.txTime)}</span> ago</p>
              </div>
              <div className="col-md-6 col-6">
                <p className="text-hash no-margin-text"><i className="bi bi-arrow-up text-danger"></i> 
                  {
                    tx.txAdditional.from ?
                      tx.txAdditional.from
                    : tx.txSender
                  }
                </p>
              </div>
              <div className="col-md-6 col-6">
                {
                  tx.txAdditional.to ?
                    <p className="text-hash no-margin-text"><i className="bi bi-arrow-return-right text-success"></i> {tx.txAdditional.to}</p>
                  : <p className="text-hash no-margin-text"><i className="bi bi-recycle text-muted"></i> update client</p>
                }
              </div>
              <div className="col-md-6 col-6">
                <p className="no-margin-text closing-p"><i className="bi bi-info"></i> {(parseInt(tx.txAdditional.amount)/10**this.state.dec).toLocaleString(undefined, {maximumFractionDigits: 6})} <span className="text-denom">{tx.txAdditional.denom}</span></p>
              </div>
              <div className="col-md-6 col-6">
                <p className="no-margin-text closing-p"><i className="bi bi-arrow-up text-danger"></i> {tx.txAdditional.fromChannel}</p>
              </div>
            </div>
          </div>
        </Link>
      )
    })
  }
  loopTxsOut(){
    const dateNow = new Date();
    return this.state.txsOut.map(tx => {
      var txDate = parseInt((dateNow-tx.txTime)/1000);
      if (txDate > 86400){
        txDate = parseInt(txDate/86400)+"d";
      }else if(txDate > 3600){
        txDate = parseInt(txDate/3600)+"h";
      }else if(txDate > 60){
        txDate = parseInt(txDate/60)+"m";
      }else{
        txDate = txDate+"s"
      }
      return(
        <Link to={`/tx/${tx.txHash}`}>
          <div className="my-container transaction-list">
            <div className="row">
              <div className="col-md-9 col-8">
                <p className="text-hash"><i className="bi bi-check-all"></i> {tx.txHash}</p>
              </div>
              <div className="col-md-3 col-4">
                <p className="text-hash text-second"><span className="stopwatch">{txDate} </span> <span style={{"display": "none"}} className="timestampSaver">{parseInt(tx.txTime)}</span> ago</p>
              </div>
              <div className="col-md-6 col-6">
                <p className="text-hash no-margin-text"><i className="bi bi-arrow-up text-danger"></i> 
                  {
                    tx.txAdditional.from ?
                      tx.txAdditional.from
                    : tx.txSender
                  }
                </p>
              </div>
              <div className="col-md-6 col-6">
                {
                  tx.txAdditional.to ?
                    <p className="text-hash no-margin-text"><i className="bi bi-arrow-return-right text-success"></i> {tx.txAdditional.to}</p>
                  : <p className="text-hash no-margin-text"><i className="bi bi-recycle text-muted"></i> update client</p>
                }
              </div>
              <div className="col-md-6 col-6">
                <p className="no-margin-text closing-p"><i className="bi bi-info"></i> {(parseInt(tx.txAdditional.amount)/10**this.state.dec).toLocaleString(undefined, {maximumFractionDigits: 6})} <span className="text-denom">{tx.txAdditional.denom}</span></p>
              </div>
              <div className="col-md-6 col-6">
                <p className="no-margin-text closing-p"><i className="bi bi-arrow-up text-danger"></i> {tx.txAdditional.fromChannel}</p>
              </div>
            </div>
          </div>
        </Link>
      )
    })
  }
  renderTokens(){
    return this.state.denom.map(tk => {
      return (<p className="p-title text-white text-left text-denom">{tk.denom}</p>)
    })
  }

  render() {
    return (
      <>
      <Summary />
      <div className="init-container no-margin">
        <div className="row">
          <div className="col-md-3">
            <h5>Channel</h5>
            <div className="my-container bg-dark account">
              <p className="text-white mt-3 h6"><b>Channel</b></p>
              <p className="p-value p-address text-white">channel-{this.props.match.params.from} & channel-{this.props.match.params.to}</p>
              <p className="text-white mt-3 h6"><b>Status</b></p>
              <p className="p-value p-address text-white closing-p mb-2"><span className="badge badge-pills bg-success">{this.state.status}</span>
              </p>
              <p className="text-white mt-3 h6"><b>Total Transaction</b></p>
              <p className="p-value p-address text-white">{(parseInt(this.state.totalIn) + parseInt(this.state.totalOut)).toLocaleString()}</p>
              <hr className="bg-white" />
              <p className="text-white mt-3 h6"><b>Tokens</b> <span className="small-text text-muted">{this.state.denom ? this.state.denom.length : 0}</span></p>
              <div className="assets">
                {
                  this.state.denom ?
                    this.renderTokens()
                  : null
                }
              </div>
            </div>
          </div>
          <div className="col-md-9">
            <div className="row">
              <div className="col-md-6">
                <h5>Transaction In</h5>
                {
                  this.state.checkTxIn ?
                  <>
                    {this.loopTxsIn()}
                    <div className="pagging">
                      <div className="row">
                        <div className="col-5">
                          <button className="btn btn-left" onClick={this.decreasePageIn} disabled={this.state.pageIn === 1 ? true : false}><i className="bi bi-arrow-left"></i> Previous</button>
                        </div>
                        <div className="col-2">
                          <span>{this.state.pageIn}</span>
                        </div>
                        <div className="col-5">
                          <button className="btn btn-right" onClick={this.increasePageIn} disabled={this.state.txsIn.length < 5 ? true : false}>Next <i className="bi bi-arrow-right"></i></button>
                        </div>
                      </div>
                    </div>
                  </>
                  : null
                }
              </div>
              <div className="col-md-6">
                <h5>Transaction Out</h5>
                {
                  this.state.checkTxOut ?
                  <>
                    {this.loopTxsOut()}
                    <div className="pagging">
                      <div className="row">
                        <div className="col-5">
                          <button className="btn btn-left" onClick={this.decreasePageOut} disabled={this.state.pageOut === 1 ? true : false}><i className="bi bi-arrow-left"></i> Previous</button>
                        </div>
                        <div className="col-2">
                          <span className="pagging-text">{this.state.pageOut}</span>
                        </div>
                        <div className="col-5">
                          <button className="btn btn-right" onClick={this.increasePageOut} disabled={this.state.txsOut.length < 5 ? true : false}>Next <i className="bi bi-arrow-right"></i></button>
                        </div>
                      </div>
                    </div>
                  </>
                  : null
                }
              </div>
            </div>
          </div>
        </div>
      </div>
      </>
    )
  }
}

export default Channel;