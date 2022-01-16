const init_state = {
  height: 0,
  txs: 0,
  channel: 0,
  tokens: 0,
  sync: false,
  chainId: "",
  theme: ""
}

const reducer = (state = init_state, action) =>  {
  switch (action.type) {
    case "GET_SUMMARY":
      return {...state, height: action.data.height, txs: action.data.txs, channel: action.data.channel, tokens: action.data.tokens, status: action.status, chainId: action.data.chainId, sync: action.data.sync}
    case "RESET_SUMMARY":
      return {...state, status: action.status}
    case "SET_THEME":
      return {...state, theme: action.theme, body: action.body, text: action.text, background: action.background}
    default:
      return state;
  }
}

export default reducer;