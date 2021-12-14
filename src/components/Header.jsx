import React from 'react';
import {Link} from 'react-router-dom';
import '../assets/styles.css';
import thecodes_white from "../thecodes_white.png";
import ReactTooltip from "react-tooltip";
import { Modal } from 'react-bootstrap';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addChain: false,
      name: "",
      ip: "",
      decimal: "",
      searchString: ""
    }
    this.addChain = this.addChain.bind(this);
  }

  closeAddChain = () => {
    this.setState({
      addChain: false
    })
  };
  openAddChain = () => {
    this.setState({
      addChain: true
    })
  };
  
  addChain(){
    if(this.state.name && this.state.ip && this.state.decimal) {
      if(localStorage.getItem("priv")){
        const list = JSON.parse(localStorage.getItem("priv"))
        list.push({name: this.state.name, node: this.state.ip, dec: this.state.decimal});
        localStorage.setItem("priv", JSON.stringify(list));
      }else{
        localStorage.setItem("priv", JSON.stringify([{name: this.state.name, node: this.state.ip, dec: this.state.decimal}]));
      }
      window.location.reload();
    }
  }
  changeChain(endpoint, dec){
    localStorage.setItem("node", JSON.stringify({end: endpoint, dec: dec}));
    window.location.reload();
  }

  renderNodes(){
    if(localStorage.getItem("nodes")){
      return JSON.parse(localStorage.getItem("nodes")).map(res => {
        return <p className="text-title" id="copy-hash" onClick={() => this.changeChain(res.node, res.dec)}>{res.name}</p>
      })
    }
  }
  renderPrivate(){
    if(localStorage.getItem("priv")){
      return JSON.parse(localStorage.getItem("priv")).map(res => {
        return <p className="text-title" id="copy-hash" onClick={() => this.changeChain(res.node, res.dec)}>{res.name}</p>
      })
    }
  }
  searchHandle(searchString){
    if(searchString){
      if(searchString.length === 64){
        window.location.href = `/tx/${searchString}`;
      }else if(searchString.length < 64 && searchString.length > 35){
        window.location.href = `/account/${searchString}`;
      }
    }
  }

  render(){
    return (
      <>
      <Modal
        show={this.state.addChain}
        onHide={this.closeAddChain}
      >
        <Modal.Body>
          <p className="h5 p-closing"><b>Add Chain</b></p>
          <hr />
          <div class="alert alert-warning" role="alert">
            The checking feature for filling out your form is being disabled. Make sure you enter the correct data.
          </div>
          <p className="p-value p-closing">Name or Label</p>
          <input type="text" className="form-control no-margin-text" value={this.state.name} onChange={e => this.setState({name: e.target.value})} placeholder="TheCodes Chain" />
          <p className="p-value p-closing mt-2">LCD Endpoint</p>
          <input type="text" className="form-control no-margin-text" value={this.state.ip} onChange={e => this.setState({ip: e.target.value})} placeholder="127.0.0.1:3031 or thecodes.dev" />
          <small class="small-text text-muted">Make sure open port for our API server 65.21.136.58.</small>
          <p className="p-value p-closing mt-2">Decimal</p>
          <input type="text" className="form-control no-margin-text" value={this.state.decimal} onChange={e => this.setState({decimal: e.target.value})} placeholder="6" />
          <div class="container">
            <div class="row">
              <div class="col text-center">
                <button class="btn btn-success mt-3" onClick={this.addChain}>Add Chain</button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <ReactTooltip id="add-chain" type="dark">
        <span>Add your chain</span>
      </ReactTooltip>
      <div className="header-div">
        <div className="header-left">
          <Link to="/"><img src={thecodes_white} alt="TheCodes Explorer" className="thecodes-header" /></Link>
          <button className="header-chain"><i className="bi bi-list-nested"></i> Chain</button>
          <div className="chains shadow-sm">
            <p className="h6 p-closing">Public <span className="text-muted small-text">{localStorage.getItem("nodes") ? JSON.parse(localStorage.getItem("nodes")).length : 0}</span></p>
            <hr className="bg-dark no-margin" />
            {this.renderNodes()}
            <p className="h6 p-closing">Private <span className="text-muted small-text">{localStorage.getItem("priv") ? JSON.parse(localStorage.getItem("priv")).length : 0}</span> <i data-tip data-for="add-chain" id="copy-hash" className="bi bi-plus-circle-dotted plus-right" onClick={this.openAddChain}></i></p>
            <hr className="bg-dark no-margin" />
            {this.renderPrivate()}
          </div>
        </div>
        <div className="header-right">
          <input type="text" className="header-search" placeholder="Search by hash, address, and height..." value={this.state.searchString} onKeyDown={(e) => e.key === "Enter" ? this.searchHandle(this.state.searchString) : null} onChange={e => this.setState({searchString: e.target.value})} />
          <button type="button" className="header-button"><i className="bi bi-search"></i></button>
        </div>
      </div>
      </>
    )
  }
}

export default Header;