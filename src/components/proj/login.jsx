import login from '../../assets/login.png';
import register from '../../assets/register.png';
import chat from '../../assets/chat.png';
function Login(){
return(
    <div>
        <h1>Features</h1>
        <div style={{display:"flex", flexDirection:"column", alignItems:"center"}}>
            <img src={login} style={{maxHeight:"500px",borderRadius:"15px"}}/>
            <p>Login page</p>
        </div>

        <div style={{display:"flex", flexDirection:"column", alignItems:"center"}}>
            <img src={register} style={{maxHeight:"500px",borderRadius:"15px"}}/>
            <p>Registration page</p>
        </div>

        <div style={{display:"flex", flexDirection:"column", alignItems:"center"}}>
            <img src={chat} style={{maxHeight:"500px",borderRadius:"15px"}}/>
            <p>Chatroom page</p>
        </div>

    </div>
);

}

export default Login;