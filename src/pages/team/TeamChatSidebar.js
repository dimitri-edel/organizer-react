import React, { useState, useEffect } from "react";
import { Nav, Navbar } from "react-bootstrap";
import { axiosReq } from "../../api/axiosDefaults";
import styles from "../../styles/TeamChat.module.css";

const TeamChatSidbar = ({ team_id, setPrivateMessageUserId, selectedTeamName }) => {

    // showUsers
    const [expanded, setExpanded] = useState(false);
    const [hasLoaded, setHasLoaded] = useState(false);
    const userNameClick = (selectedUserId) => {
        setExpanded(false);
        if (selectedUserId === "team") {
            setPrivateMessageUserId(null);
        } else {
            setPrivateMessageUserId(selectedUserId);
        }
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
                className={styles.SideBar}
            >
                <i className="fa-solid fa-user"></i>
            </Navbar.Toggle>
            <Navbar.Collapse>
                <Nav onSelect={selectedUserId => userNameClick(selectedUserId)}>
                    <Nav.Item className={styles.SideBarItem}>
                        <Nav.Link eventKey="team" >{selectedTeamName}</Nav.Link>
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
