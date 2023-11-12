import React, { useState, useEffect } from "react";
import styles from "../../styles/TeamChat.module.css";
import { useCurrentUser } from "../../context/CurrentUserContext";
import { Card, Modal, Button, Container, Row, Col, Nav, Navbar } from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom";
import { axiosReq, axiosRes } from "../../api/axiosDefaults";

const TeamChatSidbar = ({ team_id, setPrivateMessageUserId }) => {

    // showUsers
    const [expanded, setExpanded] = useState(false);
    const [hasLoaded, setHasLoaded] = useState(false);
    const userNameClick = (selectedUserId) => {
        setExpanded(false);
        alert(selectedUserId);
        setPrivateMessageUserId(selectedUserId)
    }

    const [members, setMembers] = useState([]);

    useEffect(() => {
        /**
     * Fetch all members of the team
     */
        const fetchMembers = async () => {
            try {
                // I want the Members to be ordered by their due date at all times
                const { data } = await axiosReq.get(`/team-members/${team_id}`);
                setMembers(data);
                console.log(data);
                // Signal that the content has been loaded
                setHasLoaded(true);
            } catch (err) {
                console.log(err);
            }
        };

        fetchMembers();

    }, [team_id])

    return (
        <Navbar expanded={expanded} expand="md">
            <Navbar.Toggle
                onClick={() => setExpanded(!expanded)}
                aria-controls="basic-navbar-nav"
            >
                <i className="fa-solid fa-user"></i>
            </Navbar.Toggle>
            <Navbar.Collapse>
                <Nav onSelect={selectedUserId => userNameClick(selectedUserId)}>
                    <Nav.Item>
                        {hasLoaded ? (
                            members.map(member => <Nav.Link key={member.user_id} eventKey={member.user_id}>{member.username} </Nav.Link>)

                        ) :
                            (<div>Loading ...</div>)
                        }
                    </Nav.Item>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )

}

export default TeamChatSidbar;
