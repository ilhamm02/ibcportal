import React from 'react';
import '../assets/styles.css';
import thecodes_white from "../thecodes_white.png";
import thecodes_black from "../thecodes_black.png";
import ReactTooltip from "react-tooltip";
import { Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import { setTheme } from '../redux/actions/getData';
import Axios from "axios";
import {apiURL} from '../data/API';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addChain: false,
      name: "",
      ip: "",
      ipEdit: "",
      decimal: "",
      searchString: "",
      fetching: false,
      fetched: false,
      title: "Add",
      chainId: "",
      height: "",
      sync: ""
    }
    this.addChain = this.addChain.bind(this);
  }

  componentDidMount() {
    this.getChains();
    if(cookies.get("theme")){
      if(cookies.get("theme") === "light"){
        this.props.setTheme("light", "#FDFEFE", "#000", "#fff")
        document.body.style.backgroundColor = "#F6F6F6";
      }else if(cookies.get("theme") === "dark"){
        this.props.setTheme("dark", "#121617", "#fff", "#1f2a42")
        document.body.style.backgroundColor = "#121617";
      }
    }else{
      this.props.setTheme("light", "#FDFEFE", "#000", "#fff")
      document.body.style.backgroundColor = "#F6F6F6";
      cookies.set("theme", "light", {path: "/"});
    }
    if(!cookies.get("node") || !cookies.get("nodes")){
      cookies.set("nodes", JSON.stringify([{"name":"Persistence","node":"localhost:1316","dec":6}]), {path: "/"})
      cookies.set("node", JSON.stringify({"end":"localhost:1316","dec":6,"name":"Persistence"}), {path: "/"});
    }
  }

  getChains(){
    Axios.get(`${apiURL}/chains`)
    .then(res => {
      if(res.data.result){
        cookies.set("nodes", JSON.stringify(res.data.data), {path: "/"})
        this.setState({
          chains: res.data.data
        })
      }
    })
  }

  closeAddChain = () => {
    this.setState({
      addChain: false,
      title: "Add",
      name: "",
      ip: "",
      ipEdit: "",
      decimal: "",
      fetching: false,
      fetched: false,
      alert: "",
      chainId: "",
      height: "",
      sync: "",
    })
  };
  openAddChain = () => {
    this.setState({
      addChain: true
    })
  };
  editChain = (name, dec, end) => {
    this.setState({
      ipEdit: end,
      name: name,
      ip: end,
      decimal: dec,
      title: "Edit"
    })
    this.openAddChain()
  }
  
  addChain(){
    if(this.state.name && this.state.ip && this.state.decimal) {
      var ip = this.state.ip
      if(this.state.ip.includes("http://") || this.state.ip.includes("https://")){
        ip = this.state.ip.split("//")[1]
      }
      if(!this.state.fetched){
        this.setState({
          fetching: true
        })
        Axios.get(`${apiURL}/status?rpc=${ip}` ,{timeout: 60000})
        .then(res => {
          if(res.data.result){
            this.setState({
              fetching: false,
              fetched: true,
              chainId: res.data.data.chainId,
              height: res.data.data.height,
              sync: res.data.data.sync
            })
            console.log(this.state.height)
            console.log(this.state.sync)
          }else{
            this.setState({
              fetching: false,
              fetched: false,
              alert: "Oops! We can't connect to the LCD endpoint. Please check your input or node and try again!"
            })
          }
        })
        .catch(err => {
          this.setState({
            fetching: false,
            fetched: false,
            alert: "Oops! We can't connect to the LCD endpoint. Please check your input or node and try again!"
          })
        })
      }else if(this.state.title === "Add"){
        if(cookies.get("priv")){
          if(cookies.get("priv").findIndex(x => x.node === this.state.ip) === -1) {
            if(cookies.get("priv")){
              const list = cookies.get("priv")
              list.push({name: this.state.name, node: ip, dec: this.state.decimal});
              cookies.set("priv", JSON.stringify(list), {path: "/"});
            }else{
              cookies.set("priv", JSON.stringify([{name: this.state.name, node: ip, dec: this.state.decimal}]), {path: "/"});
            }
            window.location.reload();
          }else{
            this.setState({alert: "Node already added!"});
          }
        }else{
          cookies.set("priv", JSON.stringify([{name: this.state.name, node: ip, dec: this.state.decimal}]), {path: "/"});
          window.location.reload();
        }
      }else if(this.state.title === "Edit"){
        if(cookies.get("priv").findIndex(x => x.node === this.state.ipEdit) > -1) {
          const list = cookies.get("priv").map(res => {
            if(res.node === this.state.ipEdit) {
              return {
                name: this.state.name,
                node: ip,
                dec: this.state.decimal
              }
            }else{
              return {
                name: res.name,
                node: res.node,
                dec: res.dec
              }
            }
          })
          cookies.set("priv", JSON.stringify(list), {path: "/"});
          cookies.set("node", JSON.stringify({"end":ip,"dec":this.state.decimal,"name":this.state.name}), {path: "/"});
          window.location.reload();
        }else{
          this.setState({alert: "Node not Found! May have been deleted. Try to refresh the page."});
        }
      }
    }
  }
  deleteChain(node){
    console.log(node)
    if(node){
      if(cookies.get("priv").findIndex(x => x.node === node) > -1) {
        var list = [];
        cookies.get("priv").forEach(res => {
          if(res.node !== node) {
            list.push({
              name: res.name,
              node: res.node,
              dec: res.dec
            })
          }
        })
        const nodes = cookies.get("nodes");
        cookies.set("priv", JSON.stringify(list), {path: "/"});
        cookies.set("node", JSON.stringify({"end":nodes[0].node,"dec":nodes[0].dec,"name":nodes[0].name}), {path: "/"});
        window.location.reload();
      }
    }
  }
  changeChain(endpoint, dec, name){
    cookies.set("node", JSON.stringify({end: endpoint, dec: dec, name: name}), {path: "/"});
    window.location.reload();
  }

  renderNodes(){
    if(cookies.get("nodes")){
      if(this.state.chains){
        return this.state.chains.map(res => {
          return (
            <div className="col-md-2 col-6 chain-div">
              {
                res.node === cookies.get("node").end ?
                  <button className="border border-success rounded chain bg-success opacity-50 text-light" disabled>
                    {res.name}
                  </button>
                :
                  <button className="border border-secondary rounded chain" onClick={() => this.changeChain(res.node, res.dec, res.name)}>
                    {res.name}
                  </button>
              }
            </div>
          )
        })
      }else{
        return cookies.get("nodes").map(res => {
          return (
            <div className="col-md-2 col-6 chain-div">
              {
                res.node === cookies.get("node").end ?
                  <button className="border border-success rounded chain bg-success opacity-50 text-light" disabled>
                    {res.name}
                  </button>
                :
                  <button className="border border-secondary rounded chain" onClick={() => this.changeChain(res.node, res.dec, res.name)}>
                    {res.name}
                  </button>
              }
            </div>
          )
        })
      }
    }
  }
  renderPrivate(){
    if(cookies.get("priv")){
      return cookies.get("priv").map(res => {
        return (
          <div className="col-md-2 col-6 chain-div">
            {
              res.node === cookies.get("node").end ?
                <>
                <button className="border border-success rounded chain bg-success opacity-50 text-light" disabled>
                  {res.name} <span><span className="bi bi-pen-fill small-text text-light" data-tip data-for="edit-text" onClick={() => this.editChain(res.name, res.dec, res.node)}></span><span className="bi bi-trash" data-tip data-for="delete-text" onClick={() => this.deleteChain(res.node)}></span></span>
                </button>
                <ReactTooltip id="edit-text" type="dark">
                  <span>Edit</span>
                </ReactTooltip>
                <ReactTooltip id="delete-text" type="dark">
                  <span>Delete</span>
                </ReactTooltip>
                </>
              :
              <>
                <button className="border border-secondary rounded chain" onClick={() => this.changeChain(res.node, res.dec, res.name)}>
                  {res.name}
                </button>
              </>
            }
          </div>
        )
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
  changeTheme(){
    if(this.props.fullData.theme === "dark"){
      this.props.setTheme("light", "#FDFEFE", "#000", "#1f2a42")
      document.body.style.backgroundColor = "#F6F6F6";
      cookies.set("theme", "light", {path: "/"});
    }else if(this.props.fullData.theme === "light"){
      this.props.setTheme("dark", "#212a2e", "#fff", "#fff")
      document.body.style.backgroundColor = "#121617";
      cookies.set("theme", "dark", {path: "/"});
    }
  }

  render(){
    return (
      <>
      <Modal
        show={this.state.addChain}
        onHide={this.closeAddChain}
        className="modal-chain" 
        data-theme={this.props.fullData.theme}
      >
        <Modal.Body className="modal-chain" data-theme={this.props.fullData.theme}>
          <ReactTooltip id="add-info" type="dark">
            <span>Make sure open port for our API server 65.21.136.58.</span>
          </ReactTooltip>
          <b className="h5">{this.state.title} Node</b>
          <hr/>
          <p className="p-value p-closing normal-text">Name or Label</p>
          <input type="text" className="form-control shadow-sm no-margin-text normal-text" value={this.state.name} onChange={e => this.setState({name: e.target.value})} placeholder="TheCodes Chain" readOnly={this.state.fetching} />
          <p className="p-value p-closing mt-2 normal-text">LCD Endpoint <i className="bi bi-info" data-tip data-for="add-info"></i></p>
          <input type="text" className="form-control shadow-sm no-margin-text normal-text" value={this.state.ip} onChange={e => this.setState({ip: e.target.value})} placeholder="127.0.0.1:3031 or thecodes.dev" readOnly={this.state.fetching || this.state.fetched} />
          <p className="p-value p-closing mt-2 normal-text">Decimal</p>
          <input type="number" className="form-control shadow-sm no-margin-text normal-text" value={this.state.decimal} onChange={e => this.setState({decimal: e.target.value})} placeholder="6" readOnly={this.state.fetching} />
          {
            this.state.alert ?
              <div className="alert bg-danger normal-text">
                {this.state.alert}
              </div>
            : this.state.chainId && this.state.height ?
              <div className="alert bg-success normal-text">
                <b>Node Detail</b> <br/>
                Chain ID: {this.state.chainId} <br/>
                Height: {parseInt(this.state.height).toLocaleString()} <br/>
                Syncing: {this.state.sync.toString()} <br/>
              </div>
            : null
          }
          <div class="container">
            <div class="row">
              <div class="col text-center">
                <button class="btn btn-success mt-3 normal-text" onClick={this.addChain} disabled={this.state.fetching}>
                  {
                    this.state.fetching ?
                      <>
                        <div class="spinner-border" role="status">
                          <span class="sr-only"></span>
                        </div> Fetching
                      </>
                    : `${this.state.title} Chain`
                  }
                </button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <ReactTooltip id="add-chain" type="dark">
        <span>Add your chain</span>
      </ReactTooltip>
      <ReactTooltip id="mode-text" type={this.props.fullData.theme}>
        {
          this.props.fullData.theme === "dark" ?
            "Light Mode"
          : "Night Mode"
        }
      </ReactTooltip>
      <div className="header-div" data-theme={this.props.fullData.theme}>
        <div className="header-left">
          <a href="/"><img src={this.props.fullData.theme === "light" ? thecodes_black : thecodes_white} alt="TheCodes Explorer" className="thecodes-header" /></a>
          <button className="header-chain"><i className="bi bi-hdd-network text-muted"></i> {cookies.get("node") ? cookies.get("node").name : "Persistence"}</button>
          <div className="chains shadow-sm">
            <div className="row">
              {this.renderNodes()}
              {this.renderPrivate()}
              <div className="col-md-2 col-6 chain-div">
                <button className="border border-warning rounded chain" data-tip data-for="add-chain" onClick={this.openAddChain}>
                  <span className="bi bi-plus"></span> Add node
                </button>
              </div>
            </div>
          </div>
          <div className="header-mode" data-tip data-for="mode-text" onClick={() => this.changeTheme()}>
            {
              this.props.fullData.theme === "dark" ?
              <i className="bi bi-sun"></i>
            : <i className="bi bi-moon-stars"></i>
            }
          </div>
        </div>
        <div className="header-right">
          <input type="text" className="header-search" placeholder="Search by transaction hash, or address" value={this.state.searchString} onKeyDown={(e) => e.key === "Enter" ? this.searchHandle(this.state.searchString) : null} onChange={e => this.setState({searchString: e.target.value})} />
          <button type="button" className="header-button"><i className="bi bi-search"></i></button>
        </div>
      </div>
      {
        this.props.fullData.sync ?
          <div className="chain-message bg-danger text-light">
            This chain ID is stuck at block #{parseInt(this.props.fullData.height).toLocaleString()}. There may be an endpoint or node problem.
          </div>
        : null
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

const mapDispatchToProps = {
  setTheme
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);