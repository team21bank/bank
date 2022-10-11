import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export function HomePage(): JSX.Element {
    return (
    <div className="App">
      <header className="App-header">
        <h1>Banking Application</h1>
        <h5>{"(WIP)"}</h5>
      </header>
      <Link to="/login"><Button>Login</Button></Link>
      <Link to="/register"><Button>Register</Button></Link>
    </div>)
  }