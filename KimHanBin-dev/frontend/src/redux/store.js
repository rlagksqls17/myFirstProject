import {createStore} from 'redux'
import Reducer from "./reducer"

/*
- redux 사용하는 이유 
  사용중인 user ID를 이용해서 자기 자신의 정보는 수정가능하게 하고,  
  다른 사용자의 정보는 수정하지 못하게 하기 위함입니다.

  로그인 시 사용자 ID가 redux state로 저장됩니다.
*/

const saveState = (state) => {
    try {
        const serialisedState = JSON.stringify(state);
        window.localStorage.setItem('app_state', serialisedState)
    } catch (e) {
        return
    }
}


const loadState = () => {
    try {
      const serialisedState = window.localStorage.getItem('app_state')
      if(!serialisedState) return undefined;
  
      return JSON.parse(serialisedState);
    } catch(err){
      return undefined
    }
  }
  

const oldState = loadState();
const store = createStore(Reducer, oldState)


store.subscribe(() => {
    saveState(store.getState())
})


export default store;