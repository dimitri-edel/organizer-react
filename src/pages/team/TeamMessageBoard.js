import React, { useState, useEffect } from "react";
import styles from "../../styles/TeamChat.module.css";
import { useCurrentUser } from "../../context/CurrentUserContext";
import { Card, Modal, Button, Container, Row, Col, } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import { useHistory, useParams } from "react-router-dom";
import { axiosReq, axiosRes } from "../../api/axiosDefaults";
import { fetchMoreData } from "../../utils/utils";
import Asset from "../../components/Asset";
import TeamMessage from "./TeamMessage";
import TeamMessageEditForm from "./TeamMessageEditForm";
/**
 * 
 * @param team_id - The id of the team
 * @param setReload - Function in TeamChat.js that sets the reload flag, which signifies
 * whether or not the messages have been updated and should be reloaded
 * @param - The Reload flag in TeamChat.js
 * @returns 
 */
const TeamMessageBoard = ({ team_id, setReload, reload, searchFilter, timeFilter }) => {
    const currentUser = useCurrentUser();
    // List of messages
    const [messages, setMessages] = useState([]);
    // This state signifies if the messages have been loaded
    const [hasLoaded, setHasLoaded] = useState(false);
    // Counter for total number of messages 
    const [messageCount, setMessageCount] = useState(0);

    // This state signifies if the edit button on one of the
    // messages has been clicked. If so, the id of the message
    // will be stored in editMessageId, other wise it has to
    // be set to null
    const [editMessageId, setEditMessageId] = useState(null);

    // const is_owner = currentUser?.username === owner;
    const history = useHistory();

    // Reload the messages at an interval, which is set in useEffect()
    const checkForMessages = () => {
        const fetchMessageCount = async () => {
            try {
                const { data } = await axiosReq.get(`/team-chat-message-count/${team_id}`);
                // const { data } = await axiosReq.get(`/Teams/?search=${query}`);            
                if (messageCount !== data.count) {
                    setMessageCount(data.count);
                    setReload(true);
                }

            } catch (err) {
                console.log(err);
            }
        };

        fetchMessageCount();
    }

    useEffect(() => {
        document.title = "Team Chat";
        // Fetch all Teams objects corresponding to the query, if the query is empty
        // then all Teams belonging to the user will be fetched
        const fetchMessages = async () => {
            try {
                const { data } = await axiosReq.get(`/team-chat-list/?team_id=${team_id}&limit=7&offset=0&search=${searchFilter}&minus_days=${timeFilter}`);
                // const { data } = await axiosReq.get(`/Teams/?search=${query}`);            
                setMessages(data);
                setReload(false);
                setHasLoaded(true);

            } catch (err) {
                console.log(err);
            }
        };

        fetchMessages();
        let checkMessages = setInterval(checkForMessages, 3000);

        return () => {
            // Clean up
            // clear the interval when unmounting
            clearInterval(checkMessages);
        };
    }, [team_id, reload, searchFilter, timeFilter]);


    return (
        <div id="message-board" className={styles.MessageBoard}>            
            <div>
                {
                    hasLoaded ? (
                        <>
                            {
                                messages.results.length ? (
                                    <InfiniteScroll
                                        children={messages.results.map(message => {
                                            return (
                                                <>
                                                    {
                                                        (editMessageId && editMessageId === message.id) ? (
                                                            <TeamMessageEditForm key={message.id} teamMessage={message} setReload={setReload} setEditMessageId={setEditMessageId} />) : (
                                                            <TeamMessage key={message.id} message={message} setEditMessageId={setEditMessageId} setReload={setReload} />
                                                        )
                                                    }
                                                </>
                                            )
                                        })}
                                        dataLength={messages.results.length}
                                        loader={<Asset spinner />}
                                        hasMore={!!messages.next}
                                        next={() => fetchMoreData(messages, setMessages)}
                                        scrollableTarget="message-board"
                                    />

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