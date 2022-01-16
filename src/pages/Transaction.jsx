import React from 'react';
import '../assets/styles.css';
import Summary from '../components/Summary';
import ReactTooltip from "react-tooltip";
import {apiURL, projectName} from "../data/API";
import Axios from 'axios';
import moment from 'moment';
import { connect } from 'react-redux';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

class Transaction extends React.Component {
  state={
    checkTx: false,
    loopTx: false,
    dec: cookies.get("node") ? cookies.get("node").dec : 6
  }
  componentDidMount() {
    document.title = `Transaction ${this.props.match.params.hash} | ${projectName}`;
    Axios.get(`${apiURL}/txs/detail?hash=${this.props.match.params.hash}&rpc=${cookies.get("node").end}`)
    .then(res => {
      if(res.data.data){
        this.setState({
          tx: res.data.data,
          checkTx: true,
        })
      }else{
        this.setState({
          checkTx: true,
          tx: {
            status: "Not Found",
            txTime: new Date(),
            txFee: 0,
            txHeight: 0,
            txGasUsed: 0,
            txGasWanted: 0,
            txType: "Not Found",
            txSender: "",
            txMemo: "",
            txAdditional: {
              fromChannel: "",
              toChannel: "",
              fromPort: "",
              toPort: "",
              to: "",
              height: 0,
              amount: 0,
              connection: ""
            }
          }
        })
      }
    })
    .catch(err => {
      this.setState({
        loopTx: true,
        tx: {
          status: "Not Found",
          txTime: new Date(),
          txFee: 0,
          txHeight: 0,
          txGasUsed: 0,
          txGasWanted: 0,
          txType: "Not Found",
          txSender: "",
          txMemo: "",
          txAdditional: {
            fromChannel: "",
            toChannel: "",
            fromPort: "",
            toPort: "",
            to: "",
            height: 0,
            amount: 0,
            connection: ""
          }
        }
      })
      console.error(err)
    })
  }

  copy(value){
    return (
      <>
      <ReactTooltip id="copy-hash" type="dark">
        <span>Copy</span>
      </ReactTooltip>
      <i className="bi bi-files" data-tip data-for="copy-hash" id="copy-hash" onClick={() => {navigator.clipboard.writeText(value)}}></i>
      </>
    )
  }

  render(){
    return (
      <>
      <div className="thecontainer" data-theme={this.props.fullData.theme}>
        <Summary />
        <h5>Transaction</h5>
        {
          this.state.checkTx ?
          <>
            <ReactTooltip id="date-text" type="dark">
              <span>{moment(this.state.tx.txTime).format('DD MMMM YYYY, hh:mm:ss')}</span>
            </ReactTooltip>
            <ReactTooltip id="fee" type="dark">
              <span>{this.state.tx.txFee}</span>
            </ReactTooltip>
            <ReactTooltip id="amount" type="dark">
              <span>{this.state.tx.txAdditional.amount}</span>
            </ReactTooltip>
            <ReactTooltip id="gas" type="dark">
              <span>{(this.state.tx.txGasUsed/this.state.tx.txGasWanted*100).toLocaleString(undefined, {maximumFractionDigits: 3})}%</span>
            </ReactTooltip>
            <ReactTooltip id="status-text" type="dark">
              {
                this.state.tx.status === true ?
                  <span>Confirmed</span>
                : <span>{this.state.tx.status}</span>
              }
            </ReactTooltip>
            {
              this.state.tx.status === true ?
                <span class="text-inline no-margin-text badge rounded-pill bg-success mb-2" data-tip data-for="status-text"><i class="bi bi-check-all"></i> Confirmed</span>
              : <span class="text-inline no-margin-text badge rounded-pill bg-danger mb-2" data-tip data-for="status-text"><i class="bi bi-check-all"></i> Failed</span>
            }
            <div class="text-inline vr"></div>
            <span class="text-inline no-margin-text mb-2 small-text" data-tip data-for="date-text"><i class="bi bi-clock-history"></i> {moment(this.state.tx.txTime).fromNow()}</span>
            <div class="row">
              <div class="col-xl-6">
                <div className="my-container">
                  <div className="row">
                    <div className="col-md-2">
                      <p className="p-title closing-p">Hash</p>
                    </div>
                    <div className="col-md-10">
                      <p className="p-value">{this.props.match.params.hash} {this.copy(this.props.match.params.hash)}</p>
                    </div>
                    <div className="col-md-2">
                      <p className="p-title closing-p">Height</p>
                    </div>
                    <div className="col-md-10">
                      <p className="p-value">{parseInt(this.state.tx.txHeight).toLocaleString()}</p>
                    </div>
                    <div className="col-md-2">
                      <p className="p-title closing-p">Type</p>
                    </div>
                    <div className="col-md-10">
                      <p className="p-value">{this.state.tx.txType === "Not Found" ? <span className="badge bg-danger">{this.state.tx.txType}</span> : <span className="badge bg-success">{this.state.tx.txType}</span>}</p>
                    </div>
                    <div className="col-md-2">
                      <p className="p-title closing-p">Sender</p>
                    </div>
                    <div className="col-md-10">
                      <p className="p-value">
                        {
                          this.state.tx.txAdditional.from ?
                          <> <a href={`/account/${this.state.tx.txAdditional.from}`}>{this.state.tx.txAdditional.from}</a> {this.copy(this.state.tx.txAdditional.from)}</>
                          : <> <a href={`/account/${this.state.tx.txSender}`}>{this.state.tx.txSender}</a> {this.copy(this.state.tx.txSender)}</>
                        }
                      </p>
                    </div>
                    <div className="col-md-2">
                      <p className="p-title closing-p">Fee</p>
                    </div>
                    <div className="col-md-10">
                      <p className="p-value" data-tip data-for="fee">{(parseInt(this.state.tx.txFee)/10**this.state.dec).toLocaleString(undefined, {maximumFractionDigits: 6})} <span className="text-denom">{this.state.tx.txFeeDenom}</span></p>
                    </div>
                    <div className="col-md-2">
                      <p className="p-title closing-p">Gas Used</p>
                    </div>
                    <div className="col-md-10">
                      <p className="p-value" data-tip data-for="gas">{parseInt(this.state.tx.txGasUsed).toLocaleString()}/{parseInt(this.state.tx.txGasWanted).toLocaleString()}</p>
                    </div>
                    <div className="col-md-2">
                      <p className="p-title closing-p">Memo</p>
                    </div>
                    <div className="col-md-10">
                      <p className="p-value closing-p">{this.state.tx.txMemo}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-xl-6">
                <div className="my-container">
                  <div className="connected-div">
                    <div className="connected-text bg-warning text-dark">
                      <p>{this.state.tx.txAdditional.fromChannel}</p>
                    </div>
                    <div class="connected-line bg-success"></div>
                    <div className="connected-text bg-warning text-dark">
                      <p>{this.state.tx.txAdditional.toChannel}</p>
                    </div>
                  </div>
                  <div className="connected-div">
                    <div className="connected-text bg-primary text-white">
                      <p>{this.state.tx.txAdditional.fromPort}</p>
                    </div>
                    <div class="connected-line bg-success"></div>
                    <div className="connected-text bg-primary text-white">
                      <p>{this.state.tx.txAdditional.toPort}</p>
                    </div>
                  </div>
                  <div className="row">
                    {
                      this.state.tx.txAdditional.to ?
                      <>
                        <div className="col-md-2">
                          <p className="p-title closing-p mt-3">Receiver</p>
                        </div>
                        <div className="col-md-10">
                          <p className="p-value mt-3"><a href={`/account/${this.state.tx.txAdditional.to}`}>{this.state.tx.txAdditional.to}</a> {this.copy(this.state.tx.txAdditional.to)}</p>
                        </div>
                      </>
                      : null
                    }
                    <div className="col-md-2">
                      <p className="p-title closing-p">Height</p>
                    </div>
                    <div className="col-md-10">
                      <p className="p-value">{parseInt(this.state.tx.txAdditional.height).toLocaleString()}</p>
                    </div>
                    <div className="col-md-2">
                      <p className="p-title closing-p">Sequence</p>
                    </div>
                    <div className="col-md-10">
                      <p className="p-value">{parseInt(this.state.tx.txAdditional.sequence).toLocaleString()}</p>
                    </div>
                    <div className="col-md-2">
                      <p className="p-title closing-p">Amount</p>
                    </div>
                    <div className="col-md-10">
                      <p className="p-value" data-tip data-for="amount">{(parseInt(this.state.tx.txAdditional.amount)/10**parseInt(this.state.dec)).toLocaleString(undefined, {maximumFractionDigits: 6})} <span className="badge bg-primary text-denom">{this.state.tx.txAdditional.denom}</span></p>
                    </div>
                    <div className="col-md-2">
                      <p className="p-title closing-p">Connection</p>
                    </div>
                    <div className="col-md-10">
                      <p className="p-value closing-p">{this.state.tx.txAdditional.connection}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
          :
          <>
            <div class="row">
              <div class="col-xl-6">
                <div className="my-container blank-my-container"></div>
              </div>
              <div class="col-xl-6">
                <div className="my-container blank-my-container"></div>
              </div>
            </div>
          </>
        }
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

export default connect(mapStateToProps)(Transaction);