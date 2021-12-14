import Axios from 'axios';
import { apiURL, coingeckoAPI, coingeckoID } from '../../data/API';

export const resetIBC = () => {
  return (dispatch) => {
    dispatch({
      type: 'RESET_IBC'
    })
  }
}
export const resetStatusSummary = (status) => {
  return async (dispatch) => {
    dispatch({
      type: 'RESET_STATUS_SUMMARY',
      status
    })
  }
}
export const resetStatusBlock = (status) => {
  return async (dispatch) => {
    dispatch({
      type: 'RESET_STATUS_BLOCK',
      status
    })
  }
}
export const resetStatusTransaction = (status) => {
  return async (dispatch) => {
    dispatch({
      type: 'RESET_STATUS_TRANSACTION',
      status
    })
  }
}
export const resetStatusValidator = (status) => {
  return async (dispatch) => {
    dispatch({
      type: 'RESET_STATUS_VALIDATOR',
      status
    })
  }
}
export const resetStatusPrice = (status) => {
  return async (dispatch) => {
    dispatch({
      type: 'RESET_STATUS_PRICE',
      status
    })
  }
}
export const getPathName = (pathName) => {
  return(dispatch) => {
    dispatch({
      type: 'GET_PATH_NAME',
      data: pathName
    })
  }
}
export const getBlocks = () => {
  return (dispatch) => {
    Axios.get(`${apiURL}/blocks`)
    .then((response) => {
      if(response.data.result){
        const blocksData = response.data.data.blocks;
        dispatch({
          type: 'GET_BLOCK',
          status: response.status,
          data: blocksData
        })
      }
    })
    .catch((e) => {
      dispatch({
        type: 'RESET_STATUS_BLOCK',
        status: "300"
      })
    })
  }
}
export const getValidators = () => {
  return (dispatch) => {
    Axios.get(`${apiURL}/validators`)
    .then(response => {
      if(response.data.result === true) {
        const validatorsData = response.data.data.result;
        var activeValidators = [];
        var inactiveValidators = [];
        validatorsData.forEach((validator) => {
          if(validator.statusDetails.status === "active") {
            activeValidators.push(validator);
          }else{
            inactiveValidators.push(validator);
          }
        });
        activeValidators.sort(function(a, b) {
          return a.delegated - b.delegated
        });
        activeValidators.reverse();
        inactiveValidators.sort(function(a, b) {
          return a.delegated - b.delegated
        });
        inactiveValidators.reverse();
        dispatch({
          type: 'SUMMARY_VALIDATOR',
          status: response.status,
          data: {
            activeValidators,
            inactiveValidators
          }
        })
      }
    })
    .catch(e => {
      dispatch({
        type: 'RESET_STATUS_VALIDATOR',
        status: "300",
      })
    })
  }
}
export const getTransactions = () => {
  return (dispatch) => {
    Axios.get(`${apiURL}/txs`)
    .then((response) => {
      if(response.data.result === true) {
        const txsData = response.data.data;
        dispatch({
          type: 'GET_TRANSACTION',
          status: response.status,
          data: txsData
        })
      }
    })
    .catch(e => {
      dispatch({
        type: 'RESET_STATUS_TRANSACTION',
        status: "300",
      })
    })
  }
}
export const getIBC = () => {
  return async(dispatch) => {
    let response = await Axios.get(`${apiURL}/ibcs`)
    var txData = response.data.data
    txData.sort(function(a, b) {
      return a.txHeight - b.txHeight
    });
    txData.reverse()
    if(response.data.result){
      dispatch({
        type: 'GET_IBC',
        status: response.status,
        data: txData,
      })
    }else{
      console.log("Error fetching ibc!")
    }
  }
}
export const getFilterIBC = (channel) => {
  return async(dispatch) => {
    let response = await Axios.get(`${apiURL}/ibcs?channel=${channel}`)
    var txData = response.data.data
    txData.sort(function(a, b) {
      return a.txHeight - b.txHeight
    });
    txData.reverse()
    if(response.data.result){
      dispatch({
        type: 'GET_IBC',
        status: response.status,
        data: txData,
      })
    }else{
      console.log("Error fetching ibc!")
    }
  }
}
export const getSummary = () => {
  return(dispatch) => {
    Axios.get(`${apiURL}/status`)
    .then((response) => {
      dispatch({
        type: 'SUMMARY_MOST',
        data:{
          maxValidator: response.data.maxValidators,
          syncStatus: response.data.syncStatus,
          totalSupply: response.data.totalSupply,
          bondedCoins: response.data.bondedCoins,
          blockFirst: response.data.blockFirst,
          inflation: response.data.inflation,
        },
        status: response.status,
      })
    })
    .catch(e => {
      dispatch({
        type: 'RESET_STATUS_SUMMARY',
        status: "300",
      })
    })
  }
}
export const getPrice = () => {
  return(dispatch) => {
    Axios.get(`${coingeckoAPI}/coins/${coingeckoID}`)
    .then((response) => {
      dispatch({
        type: 'GET_PRICE',
        data:{
          price: response.data.market_data.current_price.usd,
          volume: response.data.market_data.total_volume.usd,
        },
        status: response.status,
      })
    })
    .catch(e => {
      dispatch({
        type: 'RESET_STATUS_SUMMARY',
        status: "300",
      })
    })
  }
}