import { useContext } from "react";
import { AuthContext, BankContext } from "../../Authentication/auth";
import { Col, Container, Row } from "react-bootstrap";
import { DEFAULT_BANK_USER } from "../../Interfaces/BankUser";
import { BalanceGraph } from "../../BankingComponents/BalanceGraph";
import { PieCharts } from "../../BankingComponents/PieCharts";
import { ViewTransactions } from "../../BankingComponents/ViewTransactions";
import "./StudentClassPage.css";


export function StudentClassHomePage(): JSX.Element {
    const user = useContext(AuthContext).user;
    const bank = useContext(BankContext).bank;
    const bank_user = bank.studentList.find(val => val.uid === user.hash) ?? DEFAULT_BANK_USER;

    return (
        <div >
        <Container fluid style={{ paddingLeft: "5vw", paddingRight: "5vw"}}>
            <h1 style={{paddingTop: "5hv", paddingBottom: "5vh"}}>
                Your total balance is ${bank_user.balance}
            </h1>
            <Row>
                <Col sm={3}>
                    <PieCharts/>
                </Col>
                <Col sm={9}>
                    <BalanceGraph/>
                </Col>
            </Row>
            <Row>
                <ViewTransactions/>
            </Row>
        </Container>
        </div>
    )
}