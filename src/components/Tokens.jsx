import React from 'react';
import {Link} from 'react-router-dom';
import '../assets/styles.css';
import {apiURL} from '../data/API';
import Axios from 'axios';
import { Accordion, AccordionSummary, AccordionDetails } from '@material-ui/core';

class Tokens extends React.Component {
  state={
    checkTokens: false,
    checkChannel: false,
    loopTokens: false,
    loopChannel: false,
    page: 1
  }
  componentDidMount() {
    this.getTokens()
    setInterval(() => {
      if(this.state.loopTokens && this.state.loopChannel){
        this.setState({loopTokens: false});
        this.getTokens()
      }
    }, 20000);
  }

  getTokens(){
    var rpc;
    if(localStorage.getItem("node")){
      rpc = JSON.parse(localStorage.getItem("node")).end;
    }else{
      localStorage.setItem("node", JSON.stringify({end: "localhost:1315", dec: 6}))
      localStorage.setItem("nodes", JSON.stringify([{node: "localhost:1316", dec: 6, name: "Persistence"},{node: "localhost:1311", dec: 6, name: "Comdex"}, {node: "localhost:1315", dec: 6, name: "Ki Chain"}]))
      rpc = JSON.parse(localStorage.getItem("node")).end;
    }
    Axios.get(`${apiURL}/ibc/tokens/list?rpc=${rpc}`)
    .then(res => {
      this.setState({
        assets: res.data.data,
        checkTokens: true,
        loopTokens: true
      })
    })
    .catch(err => {
      this.setState({loopTokens: true})
      console.error(err)
    })
    Axios.get(`${apiURL}/ibc/channels?rpc=${rpc}`)
    .then(res => {
      this.setState({
        channels: res.data.data,
        checkChannel: true,
        loopChannel: true
      })
    })
    .catch(err => {
      this.setState({loopTokens: true})
      console.error(err)
    })
  }

  loopTokens(){
    var assetsList = [];
      var denomList = [];
      (this.state.assets).forEach(denom => {
        if(denomList.indexOf(denom.denom) < 0){
          denomList.push(denom.denom);
        }
      })
      
      denomList.forEach(denom => {
        var channelList = [];
        (this.state.assets).forEach(asset => {
          if(asset.denom === denom){
            (this.state.channels).forEach(channel => {
              if(asset.channel === channel.from){
                var color;
                if(channel.status === "STATE_OPEN"){
                  color = "green"
                }else if(channel.status === "STATE_TRYOPEN"){
                  color = "red"
                }else{
                  color = "grey"
                }
                channelList.push(
                  <Link to={`/channel/${(channel.from).split("-")[1]}/${(channel.to).split("-")[1]}`}>
                    <div className="connected-div">
                      <div className="connected-text bg-success text-white">
                        <p>Channel {(channel.from).split("-")[1]}</p>
                      </div>
                      <div class="connected-line" style={{background: color}}></div>
                      <div className="connected-text bg-success text-white">
                        <p>Channel {(channel.to).split("-")[1]}</p>
                      </div>
                    </div>
                  </Link>
                )
              }
            })
          }
        })
        assetsList.push(
          <Accordion>
            <AccordionSummary
              expandIcon={<i className="bi bi-chevron-down"></i>}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
              className="text-hash"
              style={{textTransform: "uppercase", fontWeight: "bold"}}
            >
              {denom} <b style={{"opacity": "0.75", "fontWeight": "normal", "fontSize": "13px","marginTop":"3px","marginLeft":"5px"}}>{((channelList).length)}</b>
            </AccordionSummary>
            <AccordionDetails style={{display: "block", background:"#f7f7f7"}}>
              {channelList}
            </AccordionDetails>
          </Accordion>
        )
      })
      return assetsList;
  }

  render(){
    return (
      <>
      {
        this.state.checkChannel && this.state.checkTokens ?
          this.loopTokens()
        : 
        <>
        <div className="my-container blank-my-container"></div>
        </>
      }
      </>
    )
  }
}

export default Tokens;