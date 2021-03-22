import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import {Link } from 'react-router-dom';
import 'mdbreact/dist/css/mdb.css'
import { MDBDataTableV5 } from 'mdbreact';
import '@fortawesome/fontawesome-free/css/all.css';
import 'mdbreact/dist/css/style.css';
import './DashBoard.css';
import axios from 'axios';

const DashBoard = () => {
  const urls="https://guarded-mountain-14262.herokuapp.com/";
  
  
  
  const [datatable, setDatatable]=React.useState({
    columns:[],
    rows:[]
  });
  const [data,setData]=useState({});
  useEffect(()=>{
    axios.get(urls+"getAuthUser",{withCredentials:true}).then((response)=>{
        console.log(response);
        if(response.data.message==="failed"){
              setData({});
        }  
        else{
            setData(response.data.datas);
        }      
    })
  },[])

  useEffect(() => {
    axios.get(urls+"usersList").then((response) => {
      let data=Object.values(response.data);
     
    
      data=data.map(function(item){return { ...item,url:<Link style={{color:"whitesmoke"}} to={"/user/"+item._id}>visit</Link>}});
      console.log(data);
      setDatatable({columns:[
        {
          label: 'visit',
          field: 'url',
          width:"auto",
          sort: 'asc',
          color:"white",
          border:"2px solid black",
          
          attributes: {
            'aria-controls': 'DataTable',
            'aria-label': 'Name',
          },
        },
        {
          label:'email',
          field:'email',
          sort:'asc',
          width:"auto"
        },
        {
          label: 'username',
          field: 'username',
          sort:'asc',
          width:"auto",
        }
      ],rows:data});
    });
  }, [])
  return (
    <div className="ds container-fluid pt-2 bg-dark text-center text-white">

      <div className="bg-light text-dark navs">
        <div className="brandname float-left">
          GBIndia
        </div>
        <div className="rightpart">
          
          <div>{Object.keys(data).length!==0?(<a href={"/user/"+data._id}><img src={data.userimageurl} alt="user" height="35" width="35" style={{borderRadius:"50%"}}></img><b>profile</b></a>):(<a href="/"><b>SignIn</b></a>)}</div>
        </div>
      </div>
      <div className="setsearch  row w-100 mx-auto">
          <div className="text-center text-dark col-md-12"><b>Search Profiles</b></div>
          <div className="col-md-10 py-2 setinside my-2 offset-md-1">
          <MDBDataTableV5
          dark={true}
          
          theadColor="indigo" 
          bordered
          searchLabel="Search business profiles" 
          theadTextWhite
      striped  hover
      entriesOptions={[5, 20, 25]}
      entries={5}
      responsive={true}
      pagesAmount={4}
      data={datatable}
      pagingTop
      searchTop
      searchBottom={false}
    />
          </div>
      </div>
     
    </div>

  )
}
export default DashBoard;