import React from "react";
import { Card, Col, Container, Row, Table } from "react-bootstrap";
import { useSelector } from "react-redux";

export default function UserProfile() {
  const { userInfo } = useSelector((state) => state.userState);
  const { orders } = useSelector((state) => state.orderState);

  const myOrders = orders.filter((order) => order.buyer_id === userInfo.id);

  return (
    <Container>
      <Row>
        <Col md={4}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <h4>User Information</h4>
              <p>
                <strong>Name:</strong> {userInfo.first_name} {userInfo.last_name}
              </p>
              <p>
                <strong>Email:</strong> {userInfo.email}
              </p>
              <p>
                <strong>Phone Number:</strong> {userInfo.phone_number}
              </p>
              <p>
                <strong>Location:</strong> {userInfo.location}
              </p>
              <p>
                <strong>Role:</strong> {userInfo.role}
              </p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Body>
              <h4>Orders</h4>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>PayPal Transaction</th>
                    <th>Price</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {myOrders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.service_name}</td>
                      <td>{order.paypal_transaction_id}</td>
                      <td>PHP {order.price_paid}</td>
                      <td>{new Date(order.date_purchased).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
