const TeamChatFilters = ({ setSearchFilter, setTimeFilter, searchFilter, timeFilter }) => {
    return (
        <>
            <h1>Filters</h1>
            <input value={searchFilter} onChange={e => setSearchFilter(e.target.value)} />
            <select value={timeFilter} onChange={e => setTimeFilter(e.target.value)}>
                <option value={0}>All</option>
                <option value={1}>Since yesterday</option>
                <option value={7}>1 Week</option>
                <option value={14}>2 Weeks</option>
                <option value={21}>3 Weeks</option>
            </select>
        </>
    )
}

export default TeamChatFilters;