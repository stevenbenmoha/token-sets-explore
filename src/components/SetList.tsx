import React from 'react';
import {DisplaySet} from "../classes/DisplaySet";

const SetList = ({setList}: {setList: DisplaySet[]}) => {
    return (
        <div>
            <h1>Set List</h1>
            <h2>fuck</h2>
            {setList.map((set) => (
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">{set.name}</h5>
                        <h6 className="card-subtitle mb-2 text-muted">{set.symbol}</h6>
                        <h6 className="card-subtitle mb-2 text-muted">{set.address}</h6>
                        <p className="card-text">{set.currentPositions}</p>
                    </div>
                </div>
            ))}
        </div>
    )
};

export default SetList
