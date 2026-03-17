import React, { useMemo, useState } from "react";
import { Button, Container, Form, Modal, Nav, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import { updateApplications, updateUsers } from "../actions/userActions";

export default function UserScreen() {
  const dispatch = useDispatch();
  const { users, sellerApplications } = useSelector((state) => state.userState);

  const [activeTab, setActiveTab] = useState("users");
  const [declineModal, setDeclineModal] = useState({ show: false, applicationId: null });
  const [approveModal, setApproveModal] = useState({ show: false, applicationId: null });
  const [declineReason, setDeclineReason] = useState("");
  const [merchantId, setMerchantId] = useState("");

  const nonAdminUsers = useMemo(() => users.filter((user) => user.role !== "Admin"), [users]);

  const deleteUserHandler = (userId) => {
    const nextUsers = users.filter((user) => user.id !== userId);
    dispatch(updateUsers(nextUsers));
  };

  const editUserHandler = (userItem) => {
    const updatedFirstName = window.prompt("Update first name", userItem.first_name);
    if (!updatedFirstName) return;
    const nextUsers = users.map((user) =>
      user.id === userItem.id ? { ...user, first_name: updatedFirstName } : user
    );
    dispatch(updateUsers(nextUsers));
  };

  const openApproveModal = (applicationId) => {
    setMerchantId("");
    setApproveModal({ show: true, applicationId });
  };

  const openDeclineModal = (applicationId) => {
    setDeclineReason("");
    setDeclineModal({ show: true, applicationId });
  };

  const approveApplicationHandler = () => {
    const application = sellerApplications.find((item) => item.id === approveModal.applicationId);
    if (!application) return;

    const nextApplications = sellerApplications.map((item) =>
      item.id === application.id ? { ...item, status: "Approved", decline_reason: "" } : item
    );
    const nextUsers = users.map((user) =>
      user.id === application.user_id ? { ...user, role: "Seller", merchant_id: merchantId || user.merchant_id } : user
    );

    dispatch(updateApplications(nextApplications));
    dispatch(updateUsers(nextUsers));
    setApproveModal({ show: false, applicationId: null });
  };

  const declineApplicationHandler = () => {
    const nextApplications = sellerApplications.map((item) =>
      item.id === declineModal.applicationId
        ? { ...item, status: "Declined", decline_reason: declineReason || "Declined by admin" }
        : item
    );
    dispatch(updateApplications(nextApplications));
    setDeclineModal({ show: false, applicationId: null });
  };

  return (
    <Container>
      <h3 className="mb-3">User Management</h3>
      <Nav variant="tabs" activeKey={activeTab} onSelect={(tab) => setActiveTab(tab || "users")} className="mb-3">
        <Nav.Item>
          <Nav.Link eventKey="users">Users</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="applications">Seller Applications</Nav.Link>
        </Nav.Item>
      </Nav>

      {activeTab === "users" && (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {nonAdminUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.first_name}</td>
                <td>{user.last_name}</td>
                <td>{user.email}</td>
                <td>
                  <Button size="sm" className="me-2" onClick={() => editUserHandler(user)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => deleteUserHandler(user.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {activeTab === "applications" && (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sellerApplications.map((application) => (
              <tr key={application.id}>
                <td>{application.first_name}</td>
                <td>{application.last_name}</td>
                <td>{application.email}</td>
                <td>{application.status}</td>
                <td>
                  <Button
                    size="sm"
                    className="me-2"
                    onClick={() => openApproveModal(application.id)}
                    disabled={application.status === "Approved"}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="warning"
                    onClick={() => openDeclineModal(application.id)}
                    disabled={application.status === "Declined"}
                  >
                    Decline
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={approveModal.show} onHide={() => setApproveModal({ show: false, applicationId: null })}>
        <Modal.Header closeButton>
          <Modal.Title>Approve Application</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Assign Merchant ID</Form.Label>
            <Form.Control
              value={merchantId}
              onChange={(event) => setMerchantId(event.target.value)}
              placeholder="MRC-SELLER-0001"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setApproveModal({ show: false, applicationId: null })}>
            Cancel
          </Button>
          <Button onClick={approveApplicationHandler}>Confirm Approve</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={declineModal.show} onHide={() => setDeclineModal({ show: false, applicationId: null })}>
        <Modal.Header closeButton>
          <Modal.Title>Decline Application</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Reason for Declining</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={declineReason}
              onChange={(event) => setDeclineReason(event.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDeclineModal({ show: false, applicationId: null })}>
            Cancel
          </Button>
          <Button variant="warning" onClick={declineApplicationHandler}>
            Confirm Decline
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
