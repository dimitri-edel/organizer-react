import React, { useState, useEffect } from "react";
import styles from "../../styles/TeamChat.module.css";
import { useCurrentUser } from "../../context/CurrentUserContext";
import { Card, Modal, Button, Container, Row, Col, } from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom";
import { axiosReq, axiosRes } from "../../api/axiosDefaults";
import TeamMessage from "./TeamMessage";
/**
 * 
 * @param team_id - The id of the team
 * @param setReload - Function in TeamChat.js that sets the reload flag, which signifies
 * whether or not the messages have been updated and should be reloaded
 * @param - The Reload flag in TeamChat.js
 * @returns 
 */
const TeamMessageBoard = ({ team_id, setReload, reload }) => {
    const currentUser = useCurrentUser();
    const [messages, setMessages] = useState([]);
    const [hasLoaded, setHasLoaded] = useState(false);

    // const is_owner = currentUser?.username === owner;
    const history = useHistory();

    useEffect(() => {
        document.title = "Teams";
        // Fetch all Teams objects corresponding to the query, if the query is empty
        // then all Teams belonging to the user will be fetched
        const fetchMessages = async () => {
            try {
                const { data } = await axiosReq.get(`/team-chat-list/?team_id=${team_id}&limit=7&offset=0`);
                // const { data } = await axiosReq.get(`/Teams/?search=${query}`);            
                setMessages(data);
                setReload(false);
                setHasLoaded(true);

            } catch (err) {
                console.log(err);
            }
        };

        fetchMessages();

        // clear the timer when unmounting
        return () => {
            // clearTimeout(timer);
        };
    }, [team_id, reload]);


    return (
        <div className={styles.MessageBoard}>
            {/* <h1>Message Board</h1>
            <h2>Team ID = {team_id}</h2> */}
            <div>
                {
                    hasLoaded ? (
                        <>
                            {
                                messages.results.length ? (
                                    messages.results.map(message => {
                                        return (
                                            <TeamMessage key={message.id} message={message} />
                                        )
                                    })
                                ) : (
                                    <p> No Results </p>
                                )
                            }
                        </>
                    ) : (
                        <p>Loading ... </p>
                    )
                }
            </div>
        </div>
    )
}

export default TeamMessageBoard;