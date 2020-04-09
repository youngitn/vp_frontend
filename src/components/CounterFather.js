import React,{useState} from 'react'
import Counter from './Counter';
const CounterFather = () =>{
    const [count, setCount] = useState(0);
    
    return (
        <div>
            
            <Counter fatherCount={count} fatherSetCount={setCount} faterTitle="COUNTER APP">+</Counter>
        </div>
    )
};

export default CounterFather;