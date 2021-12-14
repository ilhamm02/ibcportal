import React from 'react';
import {Link} from 'react-router-dom';
import '../assets/styles.css';
import ReactTooltip from "react-tooltip";
import QRCode from 'react-qr-code';
import Axios from 'axios';
import {apiURL, projectName} from '../data/API'

class Account extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      checkTxIn: false,
      checkTxOut: false,
      dec: localStorage.getItem("node") ? JSON.parse(localStorage.getItem("node")).dec : 6,
      pageIn: 1,
      pageOut: 1,
    }

    this.increasePageIn = this.increasePageIn.bind(this);
    this.decreasePageIn = this.decreasePageIn.bind(this);
    this.increasePageOut = this.increasePageOut.bind(this);
    this.decreasePageOut = this.decreasePageOut.bind(this);
  }
  componentDidMount() {
    document.title = `Address ${this.props.match.params.address} | ${projectName}`;
    this.getBalance()
    this.getTxsIn()
    this.getTxsOut()
  }

  getBalance() {
    var rpc;
    if(localStorage.getItem("node")){
      rpc = JSON.parse(localStorage.getItem("node")).end;
    }else{
      localStorage.setItem("node", JSON.stringify({end: "localhost:1315", dec: 6}))
      localStorage.setItem("nodes", JSON.stringify([{node: "localhost:1316", dec: 6, name: "Persistence"},{node: "localhost:1311", dec: 6, name: "Comdex"}, {node: "localhost:1315", dec: 6, name: "Ki Chain"}]))
      rpc = JSON.parse(localStorage.getItem("node")).end;
    }
    Axios.get(`${apiURL}/balance?address=${this.props.match.params.address}&rpc=${rpc}`)
    .then(res => {
      this.setState({
        balance: res.data.data
      })
    })
    .catch(err => {
      console.error(err)
    })
    this.getTxsIn();
    this.getTxsOut();
  }

  getTxsIn(page){
    if(!page){
      page = this.state.pageIn
    }
    var rpc;
    if(localStorage.getItem("node")){
      rpc = JSON.parse(localStorage.getItem("node")).end;
    }else{
      localStorage.setItem("node", JSON.stringify({end: "localhost:1315", dec: 6}))
      localStorage.setItem("nodes", JSON.stringify([{node: "localhost:1316", dec: 6, name: "Persistence"},{node: "localhost:1311", dec: 6, name: "Comdex"}, {node: "localhost:1315", dec: 6, name: "Ki Chain"}]))
      rpc = JSON.parse(localStorage.getItem("node")).end;
    }
    Axios.get(`${apiURL}/txs/list?receiver=${this.props.match.params.address}&rpc=${rpc}&page=${page}`)
    .then(res => {
      this.setState({
        txsIn: res.data.data,
        checkTxIn: true,
      })
    })
    .catch(err => {
      console.error(err)
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
      localStorage.setItem("node", JSON.stringify({end: "localhost:1315", dec: 6}))
      localStorage.setItem("nodes", JSON.stringify([{node: "localhost:1316", dec: 6, name: "Persistence"},{node: "localhost:1311", dec: 6, name: "Comdex"}, {node: "localhost:1315", dec: 6, name: "Ki Chain"}]))
      rpc = JSON.parse(localStorage.getItem("node")).end;
    }
    Axios.get(`${apiURL}/txs/list?sender=${this.props.match.params.address}&rpc=${rpc}&page=${page}`)
    .then(res => {
      this.setState({
        txsOut: res.data.data,
        checkTxOut: true,
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

  copy(value){
    return (
      <>
      <ReactTooltip id="copy-hash" type="light">
        <span>Copy</span>
      </ReactTooltip>
      <i className="bi bi-files" data-tip data-for="copy-hash" id="copy-hash" onClick={() => {navigator.clipboard.writeText(value)}}></i>
      </>
    )
  }

  renderBalance(){
    return this.state.balance.map((bal) => {
      return (
        <>
        <div className="col-6">
          <p className="p-title text-white text-left text-denom">{bal.denom}</p>
        </div>
        <div className="col-6">
          <p className="p-value p-address text-white">{(parseInt(bal.amount)/10**this.state.dec).toLocaleString(undefined, {maximumFractionDigits: 6})}</p>
        </div>
        </>
      )
    })
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
                <p className="text-hash no-margin-text"><i className="bi bi-arrow-up text-danger"></i> {tx.txSender}</p>
              </div>
              <div className="col-md-6 col-6">
                <p className="text-hash no-margin-text"><i className="bi bi-arrow-return-right text-success"></i> {tx.txAdditional.to}</p>
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

  render(){
    return (
      <>
      <ReactTooltip id="info-tip" type="light">
        <span>Amount displayed in decimal {this.state.dec}</span>
      </ReactTooltip>
      <div className="init-container">
        <div className="row">
          <div className="col-md-3">
            <h5>Account</h5>
            <div className="my-container bg-dark account">
              <div className="p-2 bg-white qr rounded text-center">
                <QRCode value={this.props.match.params.address} bgColor="#ffff" size="80" />
              </div>
              <p className="text-white mt-3 h6"><b>Account Address</b></p>
              <p className="p-value p-address text-white">{this.props.match.params.address} {this.copy(this.props.match.params.address)}</p>
              <hr className="bg-white" />
              <p className="text-white mt-3 h6"><b>Assets</b> <span className="small-text text-muted">{this.state.balance ? this.state.balance.length : 0}</span> <i className="bi bi-info" data-tip data-for="info-tip"></i></p>
              <div className="assets">
                <div className="row">
                  {
                    this.state.balance ?
                      this.renderBalance()
                    : null
                  }
                </div>
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

export default Account;