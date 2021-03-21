import React,{useState,useEffect,useMemo} from 'react';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import LinkIcon from '@material-ui/icons/Link';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import axios from 'axios';
import Select,{ components } from 'react-select'
import countryList from 'react-select-country-list'
import { useParams } from "react-router";
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import './User.css';

function User(){
    const urls="https://guarded-mountain-14262.herokuapp.com/";
    //const classes = useStyles();
    const { getName } = require('country-list');
    const [nos,setNos]=useState(true);
    let { id } = useParams();
    const [theme,setTheme]=useState(false);
    const [userfollowed,setFollowed]=useState(false);
    const [state,setState]=useState({username:'',email:'',description:'',profileUrl:'',mobileno:'',businessname:'',services:'',address:'',country:'',loginstatus:0});
    const [loading,setLoading]=useState(false);
    const [auth,setAuthenticate]=useState(false);
    const [open,setOpen]=useState(false);
    // const tokenauth=localStorage.getItem('OathToken');
    // const { decodedToken, isExpired } = useJwt(tokenauth);

    const [value, setValue] = useState('');
    const options = useMemo(() => countryList().getData(), []);
    
    let activestyle={};
    let styles={};
    
    if(theme===false){
        styles={
            color:"black",
            background:"#ffffff"
        }
        activestyle={
            color:"blue"
        }
    }
    else{
        styles={
            color:"#ffffff",
            background:"#121212"
        }
        activestyle={
            color:"whitesmoke"
        }
    }
    const SingleValue = ({ children, ...props }) => (
        <components.SingleValue {...props}>
          {children}
        </components.SingleValue>
      );

    const copyfunction=()=>{
        var copyText = document.getElementById("publicurl");
        copyText.select();
        copyText.setSelectionRange(0, 99999);
        document.execCommand("copy");
        alert("Copied Url " + copyText.value);
    }
    const changeHandlerforCountry = (e)=> {
        console.log(getName(e.value));

        setValue(getName(e.value));

    }
   const changeEventforuser=()=>{
    setOpen(true);
   }
   const closeEdit=()=>{
       setOpen(false);
   }
   var x=0;
   const handlenumberChange=(e)=>{
            console.log(e.target.value);
            x=e.target.value;
   }
   useEffect(()=>{
        
    axios.post(urls+"api/getUserData",{ids:id},{withCredentials:true}).then(response=>{
        console.log(response);
        setState({username:response.data.data[0].username,email:response.data.data[0].email,description:response.data.data[0].description,profileUrl:response.data.data[0].userimageurl,mobileno:response.data.data[0].mobileno,businessname:response.data.data[0].businessname,services:response.data.data[0].services,address:response.data.data[0].address,country:response.data.data[0].country,loginstatus:response.data.data[0].loginstatus});
        setLoading(true);
        if(response.data.authenticate===true){
            setAuthenticate(true);
        }
        else{
            setAuthenticate(false);
        }
        
            setNos(response.data.nos);
        
    }).catch(err=>{console.log("something wrong")});
   
    
},[id,auth,nos]);
   
   //follow and following functionality
   useEffect(()=>{
    if(auth===false && nos===false){
        axios.post(urls+"api/followcheckexist",{followedId:id},{withCredentials:true}).then(response=>{
            console.log(response);
            if(response.data.answerfromserver==="1"){
                    setFollowed(true);
            }
            else if(response.data.answerfromserver==="0"){
                    setFollowed(false);
            }
            else if(response.data.result==="nov"){
                    setFollowed(false);
            }
            })
       }
   },[userfollowed,auth,id,nos]);
   
   const setuserfollowedBy=()=>{
       if(auth===false && nos===false){
        axios.post(urls+"api/followcheck",{followedId:id},{withCredentials:true}).then(response=>{
                console.log(response);
                if(response.data.messagefollower==="1"){
                        setFollowed(true);
                }
                else{
                        setFollowed(false);
                }
        })
       }
        
   }
   
   
   let address="";
   const addresschange=(e)=>{
       address=e.target.value;
   }
   const addressSubmit=(e)=>{
       e.preventDefault();
       axios.post(urls+"changeaddress",{ids:id,address:address},{withCredentials:true}).then((response)=>{
                setState({...state,address:response.data.address});
                setOpen(false);
       });
   }
   const submitphone=(e)=>{
       e.preventDefault();
       if(x.toString().length===10){
        console.log("now we can submit your request");
        axios.post(urls+"submitphonenumber",{Ids:id,phonenumber:x}).then((response)=>{
            if(response.data.mobileno!=='' && response!=null){
            
                    setState({...state,mobileno:response.data.mobileno});
                    setOpen(false);
            }
        })
       }
       else{
        console.log("provide 10 digit number");
       }
        
   }
   const logouthandle=()=>{
       localStorage.removeItem("OathToken");
       setAuthenticate(false);
       axios.post(urls+"logout",{},{withCredentials:true}).then((response)=>{console.log(response)});
   }
   let businessname="";
   const submitBusiness=(e)=>{
        e.preventDefault();
        axios.post(urls+"usernamechangerequest",{sendId:id,userchange:businessname}).then(
            (response)=>{
                setState({...state,businessname:response.data.newbusiness});
                setOpen(false);
            }
        )
   }
   //count followers
   const [followers,setFollowers]=useState(0);

  
   useEffect(()=>{
    axios.post(urls+"api/countfollowers",{id:id}).then(response=>{
        console.log()
       if(response.status===200){
           setFollowers(response.data.counts);
       }
   })
   },[id,userfollowed]);
   
   //track business name
   const handleBusiness=(e)=>{
        businessname=e.target.value;
   }
   const [following,setFollowing]=useState(0);
   useEffect(()=>{
       axios.post(urls+"api/following",{id:id}).then((response)=>{
           console.log(response);
           setFollowing(response.data.counts);
       })
   },[id,following])
  
   //useeffect for getting users data
   
     const customStyles = {
        option: (provided, state) => ({
          ...provided,
          borderBottom: '2px dotted green',
          color: state.isSelected ? 'yellow' : 'black',
          backgroundColor: state.isSelected ? 'green' : 'white'
        }),
        control: (provided) => ({
          ...provided,
          marginTop: "5%",
        })
      }
      const submitCountry=(e)=>{
            e.preventDefault();
            console.log("request for country change");
            axios.post(urls+"changecountry",{ids:id,countryname:value}).then((response)=>{
                
                console.log(response);
                setState({...state,country:response.data.country});
                setOpen(false);

            });
      }
      let services="";
      const handleService=(e)=>{
            services=e.target.value;

      }
      const serviceSubmit=(e)=>{
          e.preventDefault();
          if(services!==""){
            axios.post(urls+"changeservices",{ids:id,serviceso:services}).then((response)=>{
                    setState({...state,services:response.data.services});
                    setOpen(false);
          })
          }
          
      }
      const changeTheme=(e)=>{
          console.log(e.target.value);
          if(e.target.checked===true){
                    setTheme(true);
          }
          else{
                    setTheme(false);
          }
      }
    let sendemail="https://mail.google.com/mail/?view=cm&fs=1&to="+state.email;
    return(


        <div className="container-fluid full-back-user bgc" style={theme===true?{backgroundColor:"black",color:"white"}:{backgroundColor:"white",color:"black"}}>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
  <a className="gbi" href="http://localhost:3000">GBIndia</a>
  <div className="navbar-right">
  <div className="navbar-nav">
      <a className="nav-item nav-link ac" href="/">Home<span class="sr-only">(current)</span></a>
      <a className="nav-item nav-link ac" href="/dashboard">Explore</a>
      
    </div>
  </div>
  
</nav>
            <div className="text-left">
                @dev:@deepshah1309
            </div>
            <div className="text-right">
                Theme&nbsp;
                <label className="switch">
                    <input type="checkbox" onClick={changeTheme}>
                    </input>
                    <span className="slider round"></span>
                </label>
                
            </div>
            {
                auth===true && nos===false?(<div className="row"><div className="col-md-12 card bg-light text-primary vs">You are welcomed!!!</div>
                <br></br>
                <div className="bg-dark text-right col-md-12"><button onClick={logouthandle} className="btn-outline-light btn"><ExitToAppIcon/>LogOut</button></div>
                </div>
                ):(console.log())
            }
        {
            loading ===true? (
                
                <div className="makepartround" style={styles}>
                       
                        <div className="row">
  <div className="card col-md-12" style={styles}>
  <div className="row">
                    <div className="col-6">
                        <img
                    src={state.profileUrl}
                    className="card-img userimage"
                    alt="userimage"
                    />
                <br></br>
                <div className="usernames">{state.businessname===""?(console.log()):(state.businessname)}</div>
      <div>{state.country===''?(console.log()):(<div>@{state.country}</div>)}</div>
  <div className="usernames">~@{state.username}{auth===true?(<img src="https://img.icons8.com/ios-glyphs/2x/4a90e2/guarantee--v2.gif" alt="verified" height="50" width="50" style={{borderRadius:"50%"}}></img>):(console.log("not authorised"))}</div>

                </div>
  <div className="username col-6  text-center" style={styles}>
  
  <div>{auth===true?(<div className="active" style={activestyle}>Active<CheckCircleOutlineIcon/></div>):(console.log())}</div>
  <div className="spacealign text-left mx-auto justify-content-around mt-3" style={styles}>
    
        <div className="ml-3 follow text-center pl-0" style={styles}>
            {followers}
            <br></br>
            Followers
        </div>
    
        <div className="ml-3 follow text-center pl-0" style={styles}>
        {following}
        <br></br>
        Following
        </div>
     </div>
      
        <br></br>
        {auth===false && nos===false?
      (<button className="followed  mx-auto"  onClick={setuserfollowedBy}>
      
{userfollowed===true?("unfollow"):("follow")}</button>):(auth===false && nos===true?(<div>Hey visitor SignIn with GbIndia to Follow this account</div>):(console.log()))}

  {nos===false && auth===true ?(<div><button className="btn btn-outline-primary text-white"  style={{fontSize:"1.3rem"}} onClick={changeEventforuser}><img src="https://img.icons8.com/pastel-glyph/2x/4a90e2/create-new--v4.gif" height="50" width="50" alt="edit"></img></button></div>):(<div></div>)}
  </div>
  </div>
  <div className="row">
      {state.description}
  <div>public Url<button onClick={copyfunction} className="copyurl deepshahdev">Copy Url</button>:<LinkIcon/><input type="text" value={`http://localhost:3000/user/`+id} id="publicurl"></input></div>
    </div>
  </div>
</div>
                       {auth===true && nos===false &&open===true?(<div className="card deepchanges bg-light text-dark">
                           <div className="text-right text-white bg-info deepchanges">
                               Editing panel
                           <button onClick={closeEdit} className="btn btn-danger changex">
                               X
                           </button>
                           </div>
                        <br></br>
                        <form onSubmit={submitBusiness} method="POST">
                        <h3>Provide Business name:</h3>
                        <input type="text" name="business" id="businessname" maxLength="30" onChange={handleBusiness}></input>
                        <input type="submit" value="change business name" className="inputsub"></input>
                        </form>
                        <form onSubmit={submitphone} method="POST">
                        <h3>Enter 10 digit phone no:</h3>
                        <input type="tel" name="phonenumber" id="phonenumber" maxLength="10" onChange={handlenumberChange}></input>
                        <input type="submit" value="change phone no" className="inputsub"></input>
                        </form>
                        <form onSubmit={serviceSubmit} method="POST">
                            <h3>Edit services:</h3>
                            <input type="text" name="changeservices" onChange={handleService}></input>
                            <input type="submit" className="inputsub" value="confirm the services"></input>
                        </form>
                        <form onSubmit={submitCountry} method="POST">
                        <h3>Pick country</h3>
                        
                        <Select className="set" placeholder={<div className="bg-success v text-dark">{value===''?(console.log()):(value)}</div>} components={{ SingleValue }} options={options} styles={customStyles} value={value} onChange={changeHandlerforCountry}/>
                        
                        
                        <input type="submit" className="inputsubs" value="changecountry"></input>
                        </form>
                        <form onSubmit={addressSubmit} method="POST">
                        <h3>Provide Address:</h3>
                        <input type="text" name="phonenumber" id="businessname" maxLength="200" onChange={addresschange}></input>
                        <input type="submit" value="change address" className="inputsub"></input>
                        </form>
                        <br></br>
                        <div className="text-center">@dev:deepshahMERN</div>
                        </div>):(console.log())}  

                        <div className="row pt-4 text-center" style={theme===true?{backgroundColor:"black",color:"white"}:{backgroundColor:"white",color:"black"}}>
                        
                            <div className="card col mr-2 border border-primary rounded" style={styles}>
                                <div>
                                    <img src="https://img.icons8.com/nolan/2x/4a90e2/new-contact.png" height="100" width="100" alt="contact"></img>
                                </div>
                                <b>{state.mobileno===0?(<p>yet mobile number is not provided</p>):(state.mobileno)}</b>
                            </div>
                            <div className="card  col ml-1 border border-primary rounded" style={styles}>
                                <div>
                                    <img src="https://img.icons8.com/wired/2x/4a90e2/email.png" height="100" width="100" alt="email"></img>
                                </div>
                                <b>{state.email}</b>
                                Want to send Mail?
                                <a href={sendemail} target="_blank" rel="noreferrer">Click here</a>
                            </div>
                           
                        </div>   
                        <div className="pt-3 row">
                                <div className="card  offset-md-1 col-md-9 border border-primary" style={styles}>
                                        <div>
                                            <img src="https://img.icons8.com/wired/2x/4a90e2/worldwide-location.png" height="135" width="140" style={{borderRadius:"15px"}} alt="locate"></img>
                                        </div>
                                        <div className="text-center pb-3" style={{fontSize:"larger"}}>
                                        {
                                            state.address!==""?(<b>
                               {state.address}
                                </b>):(<b>Location is not provided</b>)
                                        }

                                        </div>

                                </div>
                        </div>
                        <div className="row shadow-lg pt-4">
                                <div className=" card shadow-lg offset-md-1 bx col-md-9" style={styles}>
                                   <h1>Services<FavoriteIcon className="heart" /></h1> 
                                   <blockquote class="sidekick">
                                    {state.services===""?("services are not provided yet"):(state.services)}<cite>{state.username}</cite>
                                </blockquote>
                                </div>
                        </div>
                        <div className="row pt-4 pb-4">
                            <div style={styles} className="col-md-9 bo offset-md-1 borded border-primary rounded pb-3" >
                                   <h3>Do Follow On Social Media</h3> 
                                    <div><img alt="insta" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9XlsrxlQktSJfVq_9AthIU_nvGmL_GMIgBA&usqp=CAU" height="45" width="45" style={{borderRadius:"12px"}}></img>:yet not integrated</div>
                                    <div><img  alt="fb" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5XOpNvGZVFMYdK76kLmEqxo7c-fmg5gdYwA&usqp=CAU"  height="45" width="45" style={{borderRadius:"12px"}}></img>:yet not integrated</div>
                                    <div><img alt="twitter" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5LEV-ApZUO6OUnu1ulvL8F3L91AqHlpD0Hw&usqp=CAU" height="45" width="45" style={{borderRadius:"12px"}}></img>:yet not integrated</div>
                            </div>
                        </div> 
                </div>
            ):(<div><img src="https://img.icons8.com/windows/2x/4a90e2/iphone-spinner--v3.gif" style={{width:"100px",height:"130px"}} alt="loading"></img><br></br><img src="https://img.icons8.com/color/2x/fa314a/user-male-circle--v2.gif" alt="usertypeloading" height="50" width="50"></img></div>)
        }
        </div>
          
    )
   
}
export {User};