import {Circles} from "better-react-spinkit"
import Circle from "better-react-spinkit/dist/Circle"
import Head from "next/head"

function Loading() {
    return (
        <center style={{display:"grid", placeItems: "center" , height: "100vh"}}> 
        <Head>
            <title>Next Chat</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>
            <div>
                <img src="https://assets.stickpng.com/thumbs/580b585b2edbce24c47b23ed.png"
                    alt=""
                    style={{marginBottom:10 }}
                    height={200}
                 />
            </div>
            <Circle color = "#64c3fa" size={100} />
        </center>
    )
}

export default Loading
