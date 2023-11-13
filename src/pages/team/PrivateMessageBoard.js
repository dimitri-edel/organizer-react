import React, { useState, useEffect } from "react";
import styles from "../../styles/TeamChat.module.css";
import InfiniteScroll from "react-infinite-scroll-component";
import { axiosReq } from "../../api/axiosDefaults";
import { fetchMoreData } from "../../utils/utils";
import Asset from "../../components/Asset";
import PrivateMessage from "./PrivateMessage";
import PrivateMessageEditForm from "./PrivateMessageEditForm";
/**
 * 
 * @param team_id - The id of the team
 * @param setReload - Function in TeamChat.js that sets the reload flag, which signifies
 * whether or not the messages have been updated and should be reloaded
 * @param - The Reload flag in TeamChat.js
 * @returns 
 */
const PrivateMessageBoard = ({ privateMessageUserId, team_id, setReload, reload, searchFilter, timeFilter }) => {
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


    // Reload the messages at an interval, which is set in useEffect()
    const checkForMessages = () => {
        const fetchMessageCount = async () => {
            try {
                const { data } = await axiosReq.get(`/private-chat-message-count/${team_id}/${privateMessageUserId}`);
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
        document.title = "Private Chat";
        // Fetch all Teams objects corresponding to the query, if the query is empty
        // then all Teams belonging to the user will be fetched
        const fetchMessages = async () => {
            try {
                const { data } = await axiosReq.get(`/private-chat-list/?team_id=${team_id}&from_user_id=${privateMessageUserId}&limit=7&offset=0&search=${searchFilter}&minus_days=${timeFilter}`);
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
    }, [team_id, reload, searchFilter, timeFilter, privateMessageUserId]);


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
                                                            <PrivateMessageEditForm key={message.id} privateMessage={message} setReload={setReload} setEditMessageId={setEditMessageId} />) : (
                                                            <PrivateMessage key={message.id} message={message} setEditMessageId={setEditMessageId} setReload={setReload} />
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

export default PrivateMessageBoard;