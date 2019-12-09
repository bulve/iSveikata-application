import React from 'react'


const RecordListView = (props) =>{


    return (
    <div> 
        <table  className="table table-hover">
            <thead>
                <tr>
                    <th>Vizito data</th>
                    <th>Ligos kodas</th>
                    <th>Gydytojo vardas, pavardė</th>
                    {/* <th>Vizito aprašymas</th>
                    <th>Vizito trukmė</th>
                    <th>Vizitas kompensuojamas</th>
                    <th>Vizitas pakartotinas</th> */}
                </tr>
            </thead>
            <tbody > 
                {/* id="recorTableBody" */}
                {props.records}
            </tbody>
        </table>
        {props.notFound}
</div>)
}

export default RecordListView;