import React from 'react'


const RecordListViewDemo = (props) =>{


    return (
    <div> 
        <table className="table table-hover">
            <thead>
                <tr>
                    <th>Įrašo data</th>
                    <th>Gydytojas</th>
                    <th>Ligos kodas</th>
                </tr>
            </thead>
            <tbody>
                {props.records}
            </tbody>
        </table>
        {props.notFound}
</div>)
}

export default RecordListViewDemo;