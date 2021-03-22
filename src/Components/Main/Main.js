import React,{useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import { GoogleLogin } from 'react-google-login';
import axios from 'axios';
import './Main.css';
//import BusinessSharpIcon from '@material-ui/icons/BusinessSharp';
// function Alert(props) {
//     return <MuiAlert elevation={6} variant="filled" {...props} />;
//   }
function Main(){
    const urls="https://guarded-mountain-14262.herokuapp.com/";
    const [state, setState] = useState({userstatusmessage:'welcome to business grow portal',userGoogleId:''});
    
    const responseSuccessGoogle=(response)=>{
            console.log(response);
            console.log(response.tokenId);
            const userObj=response.profileObj;
            axios.post(urls+"api/googleLogin",{userObj}).then((responses)=>{
                console.log(responses);
    
                if(responses.data.data==="done"){
                       setState({useStatusmessage:"you are now registered in our records click the login button below",userGoogleId:responses.data.dataId});
                
                }
                else{

                    setState({userstatusmessage:"welcome back again to our website...you are our existing user",userGoogleId:responses.data.dataId});
                    
                }
            });
    }
    const loginProcess=()=>{
        if(state.userGoogleId===''){
            //do nothing
        }
        else{
            console.log("sending Id:"+state.userGoogleId);
            axios.post(urls+"users/login",{send:state.userGoogleId},{withCredentials:true}).then((response)=>{
            console.log(response);    
            const tokens=response.data.tokenValue;
                console.log(tokens);
                localStorage.setItem('OathToken', tokens);
                const checktoken=localStorage.getItem('OathToken');
                console.log(checktoken);
                setState({userstatusmessage:" you are authenticated and logged In we are going to navigate you to the profile page",userGoogleId:state.userGoogleId});
                window.location='/user/'+state.userGoogleId;
            });
        }
        
    }
    const responseErrorGoogle=(response)=>{
            console.log(response);
            console.log("there are some errors");
    }
    console.log(state.userstatusmessage);
    return(
        <div className="mainpart container-fluid bg-dark text-white min ">
             <div className="font-larger text-white bg-secondary">{state.userstatusmessage}</div>
            <div className="bg-light text-primary">
                <hr
                ></hr>
                <div className="animatez"> <b>It's all about digitalised India !!! Grow your business exponentially and let the world know about your activities</b></div>
                <hr></hr>
            </div>
            {
            state.userGoogleId===''?(
                <div className="row text-center w-50 mx-auto">
        <div className="col-md-12 text-center bs bg-secondary py-2"> 
            <div className="bg-success text-white rounds">Quick Login Process
</div>
               
            <GoogleLogin
            className="google" 
    clientId={process.env.clientID}
    buttonText="Login With Google"
    onSuccess={responseSuccessGoogle}
    onFailure={responseErrorGoogle}
    cookiePolicy={'single_host_origin'}
            />
           
        </div>
            
            </div>
            
       ):("")}
            
            <div>
                <hr></hr>
                <hr></hr>
                <br></br>
                {
                    state.userGoogleId===""?(console.log()):(<button onClick={loginProcess} className="btn btn-light text-primary">Login with GbIndia</button>)
                }
                
            </div>
            <div className="text-center pt-4">
                        <h2>Digitalised India</h2>
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_aHKKXSIQclZj2NYjJW5BmPvX2yEtHFAytQ&usqp=CAU" alt="digital" width="60%"></img>
                       <h2>Prime minister Shri narendra modi launched DIGITALISED INDIA PROJECT</h2>
                       <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_aknOvZTPgsHi3cfmChxx6H9ugaKzfQeTbw&usqp=CAU" alt="cs" width="60%"></img>
            </div>
            <div className="text=center pt-4">
                <h2>Let your business be shared to the Globe!!!!</h2>
                <img alt="growbusiness" src="https://img.freepik.com/free-photo/business-people-shaking-hands-together_53876-20488.jpg?size=626&ext=jpg" width="60%"></img>
            </div>
            <div>
                <h2>Define true content of SERVICES</h2>
                <h3>Here we are giving you some awesome features to hightlight your business profile</h3>
                <h3>Services,Address,authentication,editing panel</h3>
                <img src="https://www.softwaresuggest.com/blog/wp-content/uploads/2019/08/Challenges-of-business-service-monitoring-in-the-internet-of-services.png" alt="def"></img>
            </div>
            <div>
                <h2>Get clients and reach the maximum heights for your business</h2>
                <img alt="bi" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDvuKk7WQNOTF6EyOkEVZCz1z4zMicVMa7Hg&usqp=CAU"></img>
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGjhyk5G9d5NlS7X0LEMQCrZMDA7Omdt_LgA&usqp=CAU" alt="sec"></img>
            </div>
        </div>
    )
}
export default Main;
