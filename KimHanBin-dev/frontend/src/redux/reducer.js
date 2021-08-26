const initState = {
    ID : "" 
}

// 로그인시 입력된 id를 받아서 dispatch 함
const Reducer = (state = initState, action) => {
    switch(action.type){
        case "SETID":
            return {
                ID: action.payload
            }
        default:
            return state;
    }
}

export default Reducer;