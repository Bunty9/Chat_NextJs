import Head from "next/head"
import styled from "styled-components"
import { Button} from "@material-ui/core"
import { auth,provider } from "../firebase"


function login() {
const signIn = ()=>{
    auth.signInWithPopup(provider).catch(alert);
}

    return (
        
        <Container>
            <Head>
            <title>Next Chat</title>
            <link rel="icon" href="/favicon.ico" />
            </Head>
            

        <LoginContainer>
            <Title>Login</Title>
            <Logo src="https://assets.stickpng.com/thumbs/580b585b2edbce24c47b23ed.png" />
            <Button variant="outlined" onClick={signIn}>Sign in  Google</Button>
        </LoginContainer>
        </Container>

        
    )
}

export default login

const Container = styled.div`
display: grid;
place-items: center;
height:100vh;
background-color: whitesmoke;
`;


const LoginContainer = styled.div`
display:flex;
flex-direction: column;
align-items: center;
background-color: white;
padding:100px;
border-radius:10px;
box-shadow: 0px 4px 14px -3px rgba(0,0,0,0.7);
`;


const Title = styled.text`
padding:20px;
margin-bottom:10px;
font-family: 'Montserrat';
font-size: 32px;
`;


const Logo = styled.img`
height: 150px;
width: 150px;
margin:10px;
margin-bottom: 50px;

`;




