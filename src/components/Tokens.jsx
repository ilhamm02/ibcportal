import React from 'react';
import '../assets/styles.css';
import {apiURL} from '../data/API';
import Axios from 'axios';
import { Accordion, AccordionSummary, AccordionDetails } from '@material-ui/core';
import { connect } from 'react-redux';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

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
    Axios.get(`${apiURL}/ibc/tokens/list?rpc=${cookies.get("node").end}`)
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
    Axios.get(`${apiURL}/ibc/channels?rpc=${cookies.get("node").end}`)
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
                  <a href={`/channel/${(channel.from).split("-")[1]}/${(channel.to).split("-")[1]}`} className="d-block">
                    <div className="connected-div">
                      <div className="connected-text bg-success text-white">
                        <p>Channel {(channel.from).split("-")[1]}</p>
                      </div>
                      <div class="connected-line" style={{background: color}}></div>
                      <div className="connected-text bg-success text-white">
                        <p>Channel {(channel.to).split("-")[1]}</p>
                      </div>
                    </div>
                  </a>
                )
              }
            })
          }
        })
        assetsList.push(
          <Accordion>
            <AccordionSummary
              expandIcon={<i className="bi bi-chevron-down text-muted"></i>}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
              className="text-hash coloring"
              data-theme={this.props.fullData.theme}
              style={{textTransform: "uppercase", fontWeight: "bold"}}
            >
              {denom} <b style={{"opacity": "0.75", "fontWeight": "normal", "fontSize": "13px","marginTop":"3px","marginLeft":"5px"}}>{((channelList).length)}</b>
            </AccordionSummary>
            <AccordionDetails className="my-container rounded-0" data-theme={this.props.fullData.theme} style={{display: "block"}}>
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
        <div className="my-container blank-my-container" data-theme={this.props.fullData.theme}></div>
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

export default connect(mapStateToProps)(Tokens);