import React,{useState, useEffect} from 'react'
import PropTypes from 'prop-types'

const Counter = (props) =>{
   
    const [changeTime,setChangeTime] = useState(0);
    
useEffect(
    ()=>{
        props.fatherSetCount(100);
        console.log('test1');
    },[]);

    useEffect(
        ()=>{
            setChangeTime(changeTime+1);
            console.log('test2');
        },[props.fatherCount]);

    return (
        <div>
            <p>count:{props.fatherCount}</p>
            <button onClick={()=> props.fatherSetCount(props.fatherCount+1)}>+</button>
            <p>count的prop被更改了{changeTime}次!</p>
        </div>
    )
};

Counter.propTypes = {
    fatherCount:PropTypes.number,
    fatherSetCount:PropTypes.func,
    faterTitle: PropTypes.string

};

export default Counter;