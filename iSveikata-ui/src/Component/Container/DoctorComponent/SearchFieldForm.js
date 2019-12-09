import React from 'react'

var SearchFieldForm = (props) =>{
    return(
    <form onSubmit={props.searchHandler} className="form-inline text-center">
        <div className="form-group input-append">     
            <input id="searchFormInput" onKeyUp={props.searchHandler} type={props.searchType} className="form-control" value={props.searchValue} onChange={props.fielddHandler} placeholder={props.searchPlaceHolder} name="userName" />
        {/* </div>
        <div className="form-group">      */}
            {/* <button id="searchFormSubmit"> */}
            <i  type="submit" className="glyphicon glyphicon-search"></i>
            {/* </button> */}
        </div>
    </form>
    )
}

export default SearchFieldForm