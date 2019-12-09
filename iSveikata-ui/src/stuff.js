import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

import {Router, Route, IndexRoute, hashHistory} from 'react-router';
import {Link} from 'react-router'
<Link to={'/'+props.train_id+'/vagon/'+cargo} className='btn btn-primary'>Add cargo vagon</Link>


  var InitialApp = () =>{
    return (<div>Navigation...</div>)
  }
  var NoMatch = () =>{
    return (<div>URL no match</div>)
  }

  var RouteComponent = () =>{
    return (
      <Router history={hashHistory}  >
          <Route path="/" component={InitialApp} >
            <IndexRoute component={PlainComponent} />
            <Route path="/products" component={ProductContainer } />
            {/* <Route path="/product/:id" component={ProductDetails }  />
            <Route path="/:userName/cart" component={ProductCartContainer } />
            <Route path="/admin" component={AdminViewProductContainer } />
            <Route path="/admin/product/edit/:id" component={AdminProductEditContainer} />
            <Route path="/create" component={AdminCreateContainer}/> */}
            <Route path="*" component={NoMatch}/>
          </Route>
      </Router>)
  }

  var NavigationComponent = (props) =>{
      return (
          <nav className="navbar navbar-default">
          <div className="container-fluid">
            <ul className="nav navbar-nav">
              <li><a href="#">Home</a></li>
              <li><a href="#trains">Products</a></li>
              <li><a href="#admin">Admin</a></li>
            </ul>
          </div>
        </nav>
      )
  }

  componentWillMount = () =>{
    axios.get('http://localhost:8080/api/train')
    .then((response)=>{
        this.setState({
            trains:response.data.map(this.composeTrains)
        })
        
    })
    .catch((erorr) => {
        
    })
}

composeTrains = (train, index) => {
    return (
        <SingleTrainCardComponent train={this.state.trains} />
    )
}

constructor(props){
  super(props);
  this.train_id = this.props.params.train_id
  this.state = {
      train:''
  }
}

fieldHandler = (e) =>{
  this.setState({[e.target.name]: e.target.value})
  
  
}

setFields = (e) => {
    //this.setState({[e.target.name]: e.target.value})
    // [`product.${e.target.name}`] = e.target.value
    var product = this.state.currentProduct
    product[e.target.name] = e.target.value
    this.setState({currentProduct:product})
  }

  submitHandler = (e) =>{
    e.preventDefault();
    axios.post('http://localhost:8080/api/train', {
        number:this.state.number,
    })
    .then((response)=>{
        
        this.setState({
            number:'',
        })
    })
    .catch((erorr) => {
        
    })
}

var VagonCardComponent = (props) =>{
  return(
      <tr>
          <td>{props.type}</td>
          <button onClick={() => props.deleteHandler(props.id)} className="btn btn-danger">Remove</button>
      </tr>
  )}
<table class="table table-hover"> 
        <thead>
            <tr>
                <th>Amount of vagon</th>
                <th>Price</th>
            </tr>
        </thead>
                <tbody>
                {props.vagon}
                </tbody>
</table>

const TrainForm = (props) => {
  return (<div className="col-sm-8">
      <form onSubmit={props.onSubmit} className="form-horizontal" >
        <div className="form-group">
          <label className="control-label col-sm-2">Title:</label>
          <div className="col-sm-10">
            <input type="text" className="form-control" value={props.name } onChange={props.fieldHandler} placeholder="Product title" name="name" />
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-sm-2">Description: </label>
          <div className="col-sm-10">
            <input type="text" className="form-control" value={props.description} onChange={props.fieldHandler} placeholder="Product description" name="description" />
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-sm-2">Price:</label>
          <div className="col-sm-10">          
            <input type="text" className="form-control" value={props.price } onChange={props.fieldHandler} placeholder="Price" name="price" />
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-sm-2" >Quantoty:</label>
          <div className="col-sm-10">          
            <input type="text" className="form-control" value={props.quantity } onChange={props.fieldHandler} placeholder="Quantity" name="quantity" />
          </div>
        </div>

        <div className="form-group" style={vagon_form.passenger}>
        <label className="control-label col-sm-2" >Classes:</label>
        <select onChange={props.fieldHandler} className="form-control" name="classes">
            <option value='1'>First class</option>
            <option value='2'>Second class</option>
            <option value='3'>Third class</option>
        </select>
      </div>

      <div className="form-group" style={vagon_form.locomotyve}>
        <label className="control-label col-sm-2" >Locomotyve:</label>
        <select onChange={props.fieldHandler} className="form-control" name="type">
            <option value='forward'>Pushing forward</option>
            <option value='backward'>Pushing backward</option>
        </select>
      </div>
        <div className="form-group">        
          <div className="col-sm-offset-2 col-sm-10">
           <button className="btn btn-default">Submit</button>
          </div>
        </div>
      </form>
    </div>)  
}


showDetails = (rowIndex) =>{
  if(this.state.opendRecordRow !== rowIndex && this.state.opendRecordRow !== ''){
      let rowBefore = document.getElementsByClassName("record")[this.state.opendRecordRow]
      rowBefore.style.height = ''
      this.setState({
          opendRecordRow:rowIndex
      })
      let secondRow = document.getElementsByClassName("record")[rowIndex]
      secondRow.style.height = '250px'
  }else if(this.state.opendRecordRow === rowIndex){
      let rowBefore = document.getElementsByClassName("record")[this.state.opendRecordRow]
      rowBefore.style.height = ''
  }else{
      let row = document.getElementsByClassName("record")[rowIndex]
      row.style.height = '250px'
      this.setState({
          opendRecordRow:rowIndex
      })
  }
  
}