import React from 'react';
import '../assets/styles.css';
import {apiURL} from '../data/API';
import Axios from 'axios';
import { connect } from 'react-redux';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

class Transactions extends React.Component {
  constructor(props) {
    super(props);

    this.state={
      checkTx: false,
      loopTx: false,
      dec: cookies.get("node") ? cookies.get("node").dec : 6,
      page: 1
    }

    this.increasePage = this.increasePage.bind(this);
    this.decreasePage = this.decreasePage.bind(this);
  }
  componentDidMount() {
    this.getTxs()
    setInterval(() => {
      const timestampData = document.getElementsByClassName('timestampSaver');
      const stopwatchData = document.getElementsByClassName('stopwatch')
      const dateNow = new Date().getTime();
      var initLoop = 0;
      while (initLoop < timestampData.length) {
        var finalTimestamp = parseInt((dateNow-timestampData[initLoop].innerHTML)/1000);
        if (finalTimestamp > 86400){
          finalTimestamp = parseInt(finalTimestamp/86400)+"d";
          if(finalTimestamp > 30){
            finalTimestamp = parseInt(finalTimestamp/30)+"m"
          }else if(finalTimestamp > 7){
            finalTimestamp = parseInt(finalTimestamp/7)+"w"
          }
        }else if (finalTimestamp > 3600){
          finalTimestamp = parseInt(finalTimestamp/3600)+"h";
        }else if(finalTimestamp > 60){
          finalTimestamp = parseInt(finalTimestamp/60)+"m";
        }else{
          finalTimestamp = finalTimestamp+"s";
        }
        stopwatchData[initLoop].innerHTML = finalTimestamp;
        initLoop++
      }
    }, 1000);
    setInterval(() => {
      if(this.state.loopTx){
        this.setState({loopTx: false});
        this.getTxs()
      }
    }, 20000);
  }

  getTxs(page){
    if(!page){
      page = this.state.page
    }
    Axios.get(`${apiURL}/txs/list?rpc=${cookies.get("node").end}&page=${page}`)
    .then(res => {
      this.setState({
        txs: res.data.data,
        checkTx: true,
        loopTx: true
      })
    })
    .catch(err => {
      this.setState({
        loopTx: true,
      })
      console.error(err)
    })
  }

  increasePage(){
    this.setState({
      page: this.state.page + 1,
      loopTx: false
    })
    this.getTxs(this.state.page + 1)
  }
  decreasePage(){
    this.setState({
      page: this.state.page - 1,
      loopTx: false
    })
    this.getTxs(this.state.page - 1)
  }

  loopTxs(){
    const dateNow = new Date();
    return this.state.txs.map(tx => {
      var txDate = parseInt((dateNow-tx.txTime)/1000);
      if (txDate > 86400){
        txDate = parseInt(parseInt(txDate)/86400)+"d";
        if(parseInt(txDate) > 30){
          txDate = parseInt(parseInt(txDate)/30)+"mo"
        }else if(parseInt(txDate) > 7){
          txDate = parseInt(parseInt(txDate)/7)+"w"
        }
      }else if(parseInt(txDate) > 3600){
        txDate = parseInt(parseInt(txDate)/7)+"h";
      }else if(parseInt(txDate) > 60){
        txDate = parseInt(parseInt(txDate)/7)+"m";
      }else{
        txDate = txDate+"s"
      }
      return(
        <a href={`/tx/${tx.txHash}`}>
          <div className="my-container transaction-list" data-theme={this.props.fullData.theme}>
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
        </a>
      )
    })
  }

  render(){
    return (
      <>
      {
        this.state.checkTx ?
        <>
          {this.loopTxs()}
          <div className="pagging" data-theme={this.props.fullData.theme}>
            <div className="row">
              <div className="col-5">
                <button className="btn btn-left" onClick={this.decreasePage} disabled={this.state.page === 1 ? true : false}><i className="bi bi-arrow-left"></i> Previous</button>
              </div>
              <div className="col-2">
                <span>Page {this.state.page}</span>
              </div>
              <div className="col-5">
                <button className="btn btn-right" onClick={this.increasePage} disabled={this.state.txs.length < 5 ? true : false}>Next <i className="bi bi-arrow-right"></i></button>
              </div>
            </div>
          </div>
        </>
        :
        <>
        <div className="my-container blank-my-container" data-theme={this.props.fullData.theme}>
        </div>
        </>
      }
      </>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    fullData: state.user
  }
};

export default connect(mapStateToProps)(Transactions);