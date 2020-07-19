import { createStore } from 'redux';
import themeReducer from '../reducers/themeReducer';

export default () => {
    const store  = createStore(
        themeReducer
    )

    return store;
}