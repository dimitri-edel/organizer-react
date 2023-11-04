import React, { useState, useEffect } from "react";
import styles from "../../styles/TeamChat.module.css";
import { useCurrentUser } from "../../context/CurrentUserContext";
import { Card, Modal, Button, Container, Row, Col, } from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom";
import { axiosReq, axiosRes } from "../../api/axiosDefaults";

const TeamMessageBoard = ({ team_id }) => {
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
                console.log(data);
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
    }, [team_id]);


    return (
        <div className={styles.MessageBoard}>
            <h1>Message Board</h1>
            <h2>Team ID = {team_id}</h2>
            <div>
                {
                    hasLoaded ? (
                        <>
                            {
                                messages.results.length ? (
                                    messages.results.map(message => {
                                        return (
                                            <p>{message.message}</p>
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