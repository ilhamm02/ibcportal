const init_state = {
  syncing: true,
  statusCodeBlock: '',
  statusCodeTransaction: '',
  statusCodeValidator: '',
  statusCodeSummary: '',
  statusCodePrice: '',
  maxValidator: '0',
  totalSupply: '0',
  bondedCoins: '0',
  inflation: '100',
  price: 0,
  volume: 0,
  latestBlock: [],
  latestTransaction: [],
  latestIBC: [],
  checkIBC: false,
  activeValidators: [],
  inactiveValidators: [],
  proposals: [],
  pathName: "",
}

const reducer = (state = init_state, action) =>  {
  switch (action.type) {
    case "GET_PATH_NAME":
      return {...state, pathName: action.data}
    case "GET_BLOCK":
      return {...state, statusCodeBlock: action.status, latestBlock: action.data};
    case "SUMMARY_TRANSACTION":
      return {...state, totalTransactions: action.data};
    case "SUMMARY_MOST":
      return {...state, maxValidator: action.data.maxValidator, bondedCoins: action.data.bondedCoins, syncing: action.data.syncStatus, totalSupply: action.data.totalSupply, blockFirst: action.data.blockFirst, inflation: action.data.inflation, statusCodeSummary: action.status};
    case "GET_PRICE":
      return {...state, price: action.data.price, volume: action.data.volume, statusCodePrice: action.status}
    case "GET_TRANSACTION":
        return {...state, statusCodeTransaction: action.status, latestTransaction: action.data};
    case "SUMMARY_VALIDATOR":
      if(action.data !== init_state.activeValidators){
        return {...state, activeValidators: action.data.activeValidators, inactiveValidators: action.data.inactiveValidators, statusCodeValidator: action.status};
      }
      break;
    case "GET_IBC":
      return {...state, latestIBC: action.data, checkIBC: true}
    case "RESET_STATUS_SUMMARY":
      return {...state, statusCodeSummary: action.status}
    case "RESET_STATUS_BLOCK":
      return {...state, statusCodeBlock: action.status}
    case "RESET_STATUS_TRANSACTION":
      return {...state, statusCodeTransaction: action.status}
    case "RESET_STATUS_VALIDATOR":
      return {...state, statusCodeValidator: action.status}
    case "RESET_IBC":
      return {...state, checkIBC: false, latestIBC: []}
    case "RESET_STATUS_PRICE":
        return {...state, statusCodePrice: action.status}
    default:
      return state;
  }
}

export default reducer;