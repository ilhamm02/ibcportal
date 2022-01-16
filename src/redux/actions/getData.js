import Axios from 'axios';
import { apiURL } from '../../data/API';

export const setTheme = (theme, background, text, body) => {
  return (dispatch) => {
    dispatch({
      type: 'SET_THEME',
      theme: theme,
      background: background,
      body: body,
      text: text
    })
  }
}
export const getSummary = (rpc) => {
  return(dispatch) => {
    Axios.get(`${apiURL}/status?rpc=${rpc}`)
    .then(res => {
      dispatch({
        type: "GET_SUMMARY",
        data: res.data.data,
        status: res.status
      })
    })
  }
}