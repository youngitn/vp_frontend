const initialState = {
	darkTheme: false
}

const reducer = (state = initialState, action) => {
	switch(action.type) {
		case 'CHANGE_THEME':
			return {
				...state,
				darkTheme: !state.darkTheme
			}
		default:
			return state
	}
}

export default reducer;