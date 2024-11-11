import { useState } from 'react'
import './App.css'

function App() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("");


  function changeEmail(e) {
    setEmail(e.target.value)
  }
  function changePassword(e) {
    setPassword(e.target.value)
  }
  function handleSubmit(e) {
    e.preventDefault();
    console.log(`The Email is ${email} and the password is ${password}`);
    
  }

  const formStyling = {
    border: "2px solid grey",
    padding: "80px",
    width: "300px",
    boxShadow: "3px 3px 10px rgba(0, 0, 0, 0.1)",
    backgroundColor: "white",
    display: "flex",
    flexDirection: "column",
    textAlign: "left"
  }
  
  const inputStyling = {
    width: "100%",
    height: "30px",
    fontSize: "18px"
  }

  return (
    <>
      <form action="submit" onSubmit={handleSubmit} style={formStyling}>
        <h3>Bei ihrem Konto anmelden</h3>
        <br />
        <label htmlFor="email">
          <strong>E-Mail-Addresse</strong>
          <br />
          <input type="email" name="email" id="email" onChange={changeEmail} style={inputStyling}/>
        </label>
        <br />
        <label htmlFor="password">
          <strong>Password</strong>
          <br />
          <input type="password" name="password" id="password" onChange={changePassword} style={inputStyling}/>
        </label>
        <br />
        <br />
        <button type="submit" style={{
          backgroundColor: "blue",
          color: "white",
          padding: "15px"
        }}>Anmelden</button>
      </form>
    </>
  )
}

export default App
