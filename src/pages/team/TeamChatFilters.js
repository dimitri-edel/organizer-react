import styles from "../../styles/TeamChat.module.css"
import { Container, Row, Col } from "react-bootstrap";

const TeamChatFilters = ({ setSearchFilter, setTimeFilter, searchFilter, timeFilter }) => {
    return (
        <>
            <Container className={styles.FiltersPanel}>
                <Row>
                    <Col xs={7} >
                        <input
                            value={searchFilter}
                            onChange={e => setSearchFilter(e.target.value)}
                            className={styles.SearchField}
                            placeholder="search?"
                        />
                        <i className={"fa-solid fa-magnifying-glass " + styles.Icon}></i>
                    </Col>
                    <Col>
                        <select
                            value={timeFilter}
                            onChange={e => setTimeFilter(e.target.value)}
                            className={styles.FilterSelector}
                        >
                            <option
                                value={0}
                                className={styles.FilterSelector}
                            >All</option>
                            <option
                                value={1}
                                className={styles.FilterSelector}
                            >Since yesterday</option>
                            <option
                                value={7}
                                className={styles.FilterSelector}
                            >1 Week</option>
                            <option
                                value={14}>2 Weeks</option>
                            <option
                                value={21}
                                className={styles.FilterSelector}
                            >3 Weeks</option>
                        </select>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default TeamChatFilters;