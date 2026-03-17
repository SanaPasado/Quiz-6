import React from "react";
import { Alert, Container, Table } from "react-bootstrap";
import { useSelector } from "react-redux";

export default function SubscriptionList() {
  const { subscriptions } = useSelector((state) => state.subscriptionState);

  if (!subscriptions.length) {
    return <Alert variant="info">No subscription transactions found.</Alert>;
  }

  return (
    <Container>
      <h3 className="mb-3">Subscription Transactions</h3>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>User</th>
            <th>Tier</th>
            <th>Subscription Date</th>
          </tr>
        </thead>
        <tbody>
          {subscriptions.map((item) => (
            <tr key={item.id}>
              <td>{item.user}</td>
              <td>{item.tier}</td>
              <td>{new Date(item.subscription_date).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
