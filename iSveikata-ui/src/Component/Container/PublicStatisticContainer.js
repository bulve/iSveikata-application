import React, {Component} from 'react';
import axios from 'axios';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';

import PublicViewComponent from './PublicComponent/PublicViewComponent';

export default class PublicStatisticContainer extends Component{
    constructor(props){
        super(props)

        this.state = {
            icdStatistic:null,
            icdData:null,
            icdStatisticTable:null,

            apiStatistic:null,
            apiData:null,

            showHideIcdButton:"Pateikti duomenis lentelėje",
            showHideApiButton:"Pateikti duomenis lentelėje",
            icdButton:null,
            apiButton:null,

            icdButtonDisabled:true,
            tlkButtonDisabled:true
        }
    }
    componentWillMount = () =>{
        this.getIcdData()   
        this.getApiData()
    }

    getApiData = () =>{
        axios.get("http://localhost:8080/statistics/api/")
            .then((response) =>{
                if(response.data.length === 0){
                    this.setState({
                        apiButton:null,
                        apiStatistic:(<h4>Statistinių duomenų apie dažniausiai vartojamas vaistų aktyviąsias medžiagas nėra.</h4>),
                        tlkButtonDisabled:true
                    })
                }else{
                    this.setState({
                        apiData:response.data, 
                        tlkButtonDisabled:false                      
                    })
                }
                
            })
    }

    getIcdData = () =>{
        axios.get("http://localhost:8080/statistics/tlk/")
            .then((response) =>{
                if(response.data.length === 0){
                    this.setState({
                       icdButton:null,
                       icdStatistic:(<h4>Statistinių duomenų apie ligas, kuriomis sergama dažniausiai, nėra.</h4>),
                       icdButtonDisabled:true,
            
                    })
                }else{
                    this.setState({
                        icdData:response.data.map(this.composeIcdData),
                        icdButtonDisabled:false
                    })
                    
                }
                
            })
    }

    composeIcdData = (icd, index) =>{
        return {
            count:icd.totalCount,
            proc: Math.round(icd.totalProc * 1000) / 1000,
            icd:icd.icdCode + ' - ' + icd.title,
            icdCode:icd.icdCode,
            title:icd.title
        }
    }

    showIcdTable = () =>{
        if(this.state.showHideIcdButton === "Paslėpti lentelę"){
            this.setState({
                showHideIcdButton:"Pateikti duomenis lentelėje",
                icdStatisticTable:null
            })
        }else{
            this.setState({
                showHideIcdButton:"Paslėpti lentelę",
                icdStatisticTable:(<table className="table table-hover">
                <thead>
                    <tr>
                        <th>Susirgimų skaičius</th>
                        <th>Procentinė dalis nuo visų susirgimų</th>
                        <th>Ligos kodas ir pavadinimas</th>
                    </tr>
                </thead>
                <tbody>
            {this.state.icdData.map(this.composeIcdTable)} 
                </tbody>
                </table>)
            })
        }
    }

    showApiTable = () =>{
        
        if(this.state.showHideApiButton === "Paslėpti lentelę"){
            this.setState({
                showHideApiButton:"Pateikti duomenis lentelėje",
                apiStatisticTable:null
            })
        }else{
            this.setState({
                showHideApiButton:"Paslėpti lentelę",
                apiStatisticTable:(<table className="table table-hover">
                <thead>
                    <tr>
                        <th>Veiklioji medžiaga</th>
                        <th>Pirkimai</th>
                    </tr>
                </thead>
                <tbody>
            {this.state.apiData.map(this.composeApiTable)} 
                </tbody>
                </table>)
            })
        }
    }
    composeIcdTable = (icd, index) =>{
        return(<tr key={icd.icd}>
            <td>{icd.count}</td>
            <td>{icd.proc} %</td>
            <td>{icd.icd}</td>
            </tr>)
    }

    composeApiTable = (api, index) =>{
        return(<tr key={api.ingredientName}>
            <td>{api.ingredientName} </td>
            <td>{api.usedTimes}</td>
            </tr>)
    }

    
    showApiStatistic = () =>{
        if(this.state.apiStatistic !== null ){
            this.setState({
                apiStatistic:null,
                apiButton:null
            })
        }else{
            this.setState({
                apiStatistic: (
                    <div className="col-sm-12">
                        <h4>10 dažniausiai vartojamų vaistų veikliųjų medžiagų</h4>
                    <ResponsiveContainer height={300}>
                        <BarChart width={800} height={300}  data={this.state.apiData}
                        margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                        <XAxis dataKey="ingredientName" name="Vaisto veiklioji medžiaga"/>
                        <YAxis/>
                        <CartesianGrid strokeDasharray="3 3"/>
                        <Tooltip/>
                        <Legend verticalAlign="top" height={36} iconSize={20} />
                        <Bar stackId="one" dataKey="usedTimes" barSize={40} fill="#8884d8" background={true} name="Pirkimai" />
                        </BarChart>
                    </ResponsiveContainer >
                    </div>),
                apiButton:(<div className="text-center">
                            <button className="btn btn=primary" onClick={this.showApiTable} >{this.state.showHideApiButton}</button>
                        </div>)
                })
        }
            
    }

    showIcdStatistic = () =>{
        if(this.state.icdStatistic !== null ){
            this.setState({
                icdStatistic:null,
                icdButton:null
            })
        }else{
            this.setState({
                icdStatistic: (
                    <div className="col-sm-12">
                        <h4>10 dažniausiai pasitaikančių ligų</h4>
                    <ResponsiveContainer height={300}>
                        <BarChart width={800} height={300}  data={this.state.icdData}
                        margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                        <XAxis dataKey="icdCode" name="Ligos kodas"/>
                        <YAxis/>
                        <CartesianGrid strokeDasharray="3 3"/>
                        <Tooltip/>
                        <Legend verticalAlign="top" height={36} iconSize={20} />
                        <Bar stackId="one"  legendType="none" dataKey="title" barSize={40} fill="none" background={true} name="Ligos pavadinimas"  />
                        <Bar stackId="one" dataKey="proc" barSize={40} fill="#8884d8" background={true} name="Susirgimų dažnumas" unit=" %" />
                        <Bar stackId="one"  legendType="none" dataKey="count" barSize={40} fill="#8884d8" background={true} name="Susirgimų dažnumas" unit=" kartai" />
                        </BarChart>
                    </ResponsiveContainer>
                    </div>),
                icdButton: (<div className="text-center">
                            <button className="btn btn=primary" onClick={this.showIcdTable} >{this.state.showHideIcdButton}</button>
                        </div>)
                })
        }
    }

    



    render() {
        return (
                <section>
                    
                    <PublicViewComponent
                    showIcdStatistic={this.showIcdStatistic}
                    showApiStatistic={this.showApiStatistic}

                    icdStatistic={ this.state.icdStatistic} 
                    icdButton={this.state.icdButton}
                    icdTable={this.state.icdStatisticTable}

                    icdButtonDisabled={this.state.icdButtonDisabled}
                    tlkButtonDisabled={this.state.tlkButtonDisabled}

                    apiStatistic={this.state.apiStatistic}
                    apiButton={this.state.apiButton}
                    apiTable={this.state.apiStatisticTable}
                    />
                </section>
        )
    }
}