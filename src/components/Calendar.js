import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import styles from "../styles/Calendar.module.css";
import TaskListItem from "./TaskListItem";
import { axiosReq } from "../api/axiosDefaults";
import Asset from "../components/Asset";
import appStyles from "../App.module.css";
import StaticContext from "../context/StaticContext";


/**
 * Calendar allows the user to select a month or day, which will be used to display tasks
 * of the selected month or day. It also displays a miniature task list for each day underneath
 * the day number.
 */
class Calendar extends React.Component {
    /**
    *    @static
    *    @property
    *    IS_DAY_SSELECTED_INDEX is us as an index in the array calendar_cells,
    *    which is stored in the state. It is the index in the attachments for the cell,
    *    at which a boolean value will be stored. True if the day is marked as selected,
    *    False if the day is not selected by user. The day will be marked as selected 
    *    if the user clicks on that date
    */
    static IS_DAY_SSELECTED_INDEX = 1;
    /**
    *   @static
    *   @property
    *   DAY_NUMBER_INDEX is used as an index in the array calendar_cells,
    *   which is stored in the state. It is the index in the attachments for the cell.
    *   At this index lives the number of the day  (1- 31)
    */
    static DAY_NUMBER_INDEX = 0;
    /**
    *   @static
    *   @property
    *   ITEM_LIST_INDEX is a static property of this class andis used as an index in 
    *   the array calendar_cells,
    *   which is stored in the state. It is the index in the attachments for the cell. 
    *   At this index lives an array with tasks, that belong to that day
    */
    static ITEM_LIST_INDEX = 2;



    constructor(props) {
        super(props);
        let current_date = new Date();
        /** The search query that will be attached to the URL in TaskList.js         */
        this.setQuery = props.setQuery;
        /** Array that holds the day names that will be diplayed in the row of headings */
        this.weekday_names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        /**  Names of months that will be used in the control panel */
        this.month_names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];


        this.state = {
            // Set the current date
            current_date: current_date,
            // Set the selected date, year and month to the current date
            selected_date: current_date.getDate(),
            selected_month: current_date.getMonth(),
            selected_year: current_date.getFullYear(),
            selected_month_name: this.month_names[current_date.getMonth()],
            calendar_cells: [], // contain calendar_cells[row][column][attachments]
            selectedMonthTaskList: { results: [] },
            selectedMonthQuery: "",
            hasLoaded: false,
            select_current_date: true,
        };
    }
    /** Component was mounted  */
    componentDidMount() {
        // Make sure that the query for this month is initialized
        this.setState({ selectedMonthQuery: this.getSelectedMonthQuery() });
        // Get the task list for the selected month. The miniature task list
        // that will be displayed underneath the day numbers in the calendar
        this.#fetchSelectedMonth();
        // Select the current date for the context
        StaticContext.SELECTED_DATE = new Date();
    }
    /**
     * Reflect the month selection in the Calendar
     */
    initMonth = () => {
        /** Set the query for the URL (&search=) in the parent component */
        this.setQuery(this.state.selectedMonthQuery);
        /** Render the calendar cells according to the selected month and year  */
        this.#setMonth(this.state.selected_month, this.state.selected_year);
    }

    /**
     * Fetch all tasks in the given month.The miniature task list that 
     * will be displayed underneath the day numbers in the calendar
     */
    #fetchSelectedMonth = async () => {
        try {
            const { data } = await axiosReq.get(`/tasks/?search=${this.state.selectedMonthQuery}&limit=100&offset=0`);
            this.setState({
                selectedMonthTaskList: data,
                hasLoaded: true,
            }, this.initMonth);
        } catch (err) {
            console.log(err);
        }
    };
    /**
     * Turn the state properties that show which month was selected by the user into a date string.
     * @returns String that represents the correct representation of the month, or the current data if the calendar is beeing 
     * initialized 
     */
    getSelectedMonthQuery = () => {
        const getDateNumberRepresentaion = (num) => {
            if (num < 10) {
                return `0${num}`;
            }
            return num;
        }
        let year = this.state.selected_year;
        let month = getDateNumberRepresentaion(this.state.selected_month + 1);
        let day = getDateNumberRepresentaion(this.state.selected_date);

        // When the calendar has mounted select the current date
        if (this.state.select_current_date) {
            this.setState({
                select_current_date: false
            })
            return `${year}-${month}-${day}`;
        }
        // Set the Query for the TaskList(parent element) to show the tasks for the selected month
        return `${year}-${month}`;
    }
    /**
     * Get a fragment with the Calendar control panel
     * @returns JSX That represents the Control panel with buttons for selecting next month, previous month, or a button
     * with the month name and year, which allows users to unselect a day and select the entire month instead
     */
    controlPanel = () => {
        const left_icon = "fa-solid fa-angle-left";
        const right_icon = "fa-solid fa-angle-right";
        return (
            <>
                <Container className={styles.calendarControlPanel}>
                    <Row>
                        <Col>
                            <button onClick={this.onClickPrevMonth} className={styles.ControlButton}>
                                <i className={left_icon}></i>
                            </button>
                        </Col>
                        <Col className={styles.MonthColumn}>
                            <button onClick={this.onClickSelectedMonthButton} className={styles.ControlButton}>{this.state.selected_month_name} {this.state.selected_year}</button>
                        </Col>
                        <Col>
                            <button onClick={this.onClickNextMonth} className={styles.ControlButton}>
                                <i className={right_icon}></i>
                            </button>
                        </Col>
                    </Row>
                </Container>
            </>
        )
    }
    /**
     * Event handler for the click on the middle button on the control panel that show the name of month and year.
     * If the user selected a particular day in the calendar, then the day selection is cleared and the whole month
     * is selected instead
     */
    onClickSelectedMonthButton = () => {
        /**
         *  Callback function that is called after the selcted_date is set to 0, which signals that no day is selected.
         * It selects a new query for this month, and then calls initMonth, which will in turn reinitialize the Month
         * so it shows no selcted day
         */
        const adjustQuery = () => {
            this.setState({
                selectedMonthQuery: this.getSelectedMonthQuery(),
            }, this.initMonth);
        }
        this.setState({
            selected_date: 0,
        }, adjustQuery);
    }
    /**
     * Event handler for the click on the previous month on the control panel of the calendar.
     * It sets off a chain of changes in the state object that will make the calendar show the previous Month
     * and also select it
     */
    onClickPrevMonth = () => {
        // Display the loading spinner, and call the calculate previous month method (#calculatePrevMonth)
        this.setState({
            hasLoaded: false,
        }, this.#calculatePrevMonth);

    }
    /**
     * Event handler for the click on the next month on the control panel of the calendar.
     * It sets off a chain of changes in the state object that will make the calendar show the next Month
     * and also select it
     */
    onClickNextMonth = () => {
        // Display the loading spinner, and call the calculate next month method (#calculateNextMonth)
        this.setState({
            hasLoaded: false,
        }, this.#calculateNextMonth);
    }
    /**
     * Event handler for a click on one of the days in the calendar.
     * @param {Array} cell - Array with the values attached to the cell. 
     * The indices of the array are declared as static properties of the Calendar class.
     * Those are DAY_NUMBER_INDEX, IS_DAY_SSELECTED_INDEX and ITEM_LIST_INDEX
     * @param {Integer} row - number of the row in the calendar_cells
     * @param {Integer} col - number of the column in the calendar_cells
     */
    onClickCalendarCell = (cell, row, col) => {
        /** See if the string is a representation of a number */
        const isNumeric = (str) => {
            // If not a string then don't bother processing
            if (typeof str != "string") return false;
            if (str === "") return false;
            return !isNaN(str);
        }
        /**
         * Turn a number into a two-digit representation
         * @param {Integer} num 
         * @returns String of two digits. If num is 1 the return value is "01"
         */
        const getDateNumberRepresentaion = (num) => {
            if (num < 10) {
                return `0${num}`;
            }
            return num;
        }
        /**
         * Copy of the state property calendar_cells, that is used for rendering each cell
         * in the calendar. calendar_cells[row][column][cell]
         */
        let new_cells = this.state.calendar_cells;
        /**
         * mark all the cells in the copy of calendar_cells as not selected
         *  */
        for (let row_index = 1; row_index < new_cells.length; row_index++) {
            let current_row = new_cells[row_index];

            for (let col_index = 1; col_index < current_row.length; col_index++) {
                current_row[col_index][Calendar.IS_DAY_SSELECTED_INDEX] = false;
            }
        }
        /**
         * Mark the cell, that has been clicked on, as selected
         *  */
        new_cells[row][col][Calendar.IS_DAY_SSELECTED_INDEX] = true;
        // Prepare variables, whose combination reflects the selected date
        // for the new query that will be passed to the parent element
        let year = this.state.selected_year;
        let month = getDateNumberRepresentaion(this.state.selected_month + 1);
        let day = cell[Calendar.DAY_NUMBER_INDEX];
        if (isNumeric(day)) {
            // Generate a query for this day and pass it to TaskList(parent element)
            let query = `${year}-${month}-${getDateNumberRepresentaion(day)}`;
            this.setQuery(query);
            StaticContext.SELECTED_DATE = new Date(year, month, day);

            // Put the new copy of calendar_cells in the state object
            this.setState({
                calendar_cells: new_cells,
                selected_date: day,
            });
        }
    }
    /**
     * First, calculate month and year of the previous month, then
     * update the elements that use the updated values
     */
    #calculatePrevMonth = () => {
        let current_month = this.state.selected_month;
        if (current_month === 0) {
            this.setState((prevState, props) => ({
                selected_month: 11,
                selected_year: prevState.selected_year - 1,
                selected_month_name: this.month_names[11],
            }), this.#updateSelectedMonthQueryDependantElements);
        } else {
            this.setState((prevState, props) => ({
                selected_month: prevState.selected_month - 1,
                selected_month_name: this.month_names[prevState.selected_month - 1]
            }), this.#updateSelectedMonthQueryDependantElements);
        }
    }
    /**
    * First, calculate month and year of the next month, then
    * update the elements that use the updated values
    */
    #calculateNextMonth = () => {
        let current_month = this.state.selected_month;
        if (current_month === 11) {
            this.setState((prevState, props) => ({
                selected_month: 0,
                selected_year: prevState.selected_year + 1,
                selected_month_name: this.month_names[0]
            }), this.#updateSelectedMonthQueryDependantElements);
        } else {
            this.setState((prevState, props) => ({
                selected_month: prevState.selected_month + 1,
                selected_month_name: this.month_names[prevState.selected_month + 1],
            }), this.#updateSelectedMonthQueryDependantElements);
        }
    }
    /**
     * Update all elements that depend on the value of this.state.selectedMonthQuery
     */
    #updateSelectedMonthQueryDependantElements = () => {
        this.setState({
            selectedMonthQuery: this.getSelectedMonthQuery(),
        }, this.#fetchSelectedMonth);

    }
    /**
     * Returns true if the year parameter is a leap year
     *  */
    #isLeapYear(year) {
        return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
    }
    /**
     * Inhabit the sate object callendar_cells with corresponding values.
     * This.state.calendar_cells holds a multidimensional array with Iformation that is 
     * relevant for rendering each individual cell in the Calendar.
     * This.state.calendar_cells[row][column][cell]
     * At the cell index you have an array of ,currently, three elements: 
     * 
     * 1) The day number(1-31),
     * 2) A boolean value that shows whether or not the day has been selected(clicked on by the user),
     * 3) An array that harbors a list of taks for the given day
     * @param {Integer} month 
     * @param {Integer} year 
     */
    #setMonth = (month, year) => {
        // Determine which weekday is the first day of the month
        let first_day = new Date(year, month, 1);
        // Weekdays are numbered 0-6, 0:Sunday, 1:monday, 2:tuesday, etc.
        let first_week_day = first_day.getDay();
        // Find out how many days in the month
        let last_day_of_month = this.#getLastDayOfMonth(month, year);
        // calculate the number of rows required for the month
        const get_number_of_rows = () => {
            // If the month begins with a friday and more than 30 days long
            if ((first_week_day === 5) && (last_day_of_month > 30)) {
                return 6;
            } // if a month begins with a saturday and is more than 29 days long
            else if ((first_week_day === 6) && (last_day_of_month > 29)) {
                return 6;
            }
            return 5;
        }
        // number of rows in the calendar
        let number_of_rows = get_number_of_rows();

        /**
         * Create an array representation of calendar cells as they are
         * required for this.state.calenbdar_cells 
         * @returns An array representation of calendar cells
         */
        const create_calendar_cells = () => {
            let cells = [];

            for (let row = 1; row <= number_of_rows; row++) {
                cells[row] = [];
                for (let column = 1; column <= 7; column++) {
                    cells[row][column] = [];
                    cells[row][column][Calendar.DAY_NUMBER_INDEX] = "";
                    cells[row][column][Calendar.IS_DAY_SSELECTED_INDEX] = false;
                    cells[row][column][Calendar.ITEM_LIST_INDEX] = [];
                }
            }

            return cells;
        }

        let cal_cells = create_calendar_cells();
        // The offset for the number of the day that will be plotted in the cell label
        let day_number = 1;

        // the rows and columns are numbered 1-7
        for (let row = 1; row <= number_of_rows; row++) {
            for (let column = 1; column <= 7; column++) {

                // If its the first week(first row) and the first_week_day is not in the 
                // corresponding column(day of week) skip the column
                // Tthe english format is used
                // which means that the weekday slides one column to the left, hence column-1
                if (row === 1 && (column - 1) < first_week_day) {
                    continue;
                }

                // If the last day of month has been reached, beak out of the loop
                // there is no more days in the month left
                if (day_number > last_day_of_month) {
                    break;
                }
                // Plot the day number in the cell as the first element of the array                
                cal_cells[row][column][Calendar.DAY_NUMBER_INDEX] = day_number.toString();

                // If the selected date and current date coincide, then mark the cell as selected
                if ((day_number === this.state.current_date.getDate()) &&
                    (day_number === this.state.selected_date) &&
                    (this.state.current_date.getMonth() + 1 === this.state.selected_month + 1)) {
                    cal_cells[row][column][Calendar.IS_DAY_SSELECTED_INDEX] = true;
                }
                // Get the list of tasks for the day and append it to the array
                // month number needs correction, because they start with 0
                cal_cells[row][column][Calendar.ITEM_LIST_INDEX] = this.#getDaysTaskList(day_number, month + 1, year);
                // Proceed to the next day
                day_number++;
            }
        }
        this.setState({ calendar_cells: cal_cells });
    }

    /**
     * If there is a list of tasks for this day then return an array with tasks, else return an empty array.
     * The list of tasks is stored in this.state.selectedMonthTaskList.results
     * @param {Integer} day 
     * @param {Integer} month 
     * @param {Integer} year 
     * @returns Array task objects for the day. Each task is a dictionary, which can be accessed like arr[index].property
     */
    #getDaysTaskList = (day, month, year) => {
        let arr = [];

        /**
         * Check if the due_date is the same as the date specified in the parameter list passed to this method
         * @param {due_date String representation of the datetime in the Format coming from the API : like 02. Aug 2023 10:00} due_date 
         * @returns true if the due_date parameter is equivalent to the day, month and year sent to the parent function
         */
        const isSameDate = (due_date) => {
            const split = due_date.split(" ");
            const strMonnths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const monthNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
            const strDay = split[0];
            const strMonth = split[1];
            const strYear = split[2];

            let month_number = 0;
            let year_number = parseInt(strYear);
            let day_number = parseInt(strDay);

            for (let i = 0; i < strMonnths.length; i++) {
                if (strMonnths[i].toLowerCase() === strMonth.toLowerCase()) {
                    month_number = monthNumbers[i];
                }
            }

            if ((day === day_number) && (month === month_number) && (year === year_number)) {
                return true;
            }
            return false;
        }
        /**
         * Filter out the tasks for the given day and attach them to the array
         */
        const getList = () => {
            for (let i = 0; i < this.state.selectedMonthTaskList.results.length; i++) {
                if (isSameDate(this.state.selectedMonthTaskList.results[i].due_date)) {
                    arr[i] = this.state.selectedMonthTaskList.results[i];
                }
            }
        }

        getList();
        return arr;
    }
    /**
     * Determine the length of a month 
     * @param {Integer} month 
     * @param {Integer} year 
     * @returns The length of the month specified in the parameters
     */
    #getLastDayOfMonth = (month, year) => {
        // Since months are numbered 0-11, the number of days in each month can
        // be stored in the array, where the index corresponds to the month number
        let days_in_month = [];
        days_in_month[0] = 31; // January
        days_in_month[1] = this.#isLeapYear(year) ? 29 : 28; // February
        days_in_month[2] = 31; // March
        days_in_month[3] = 30; // April
        days_in_month[4] = 31; // May
        days_in_month[5] = 30; // June
        days_in_month[6] = 31; // July
        days_in_month[7] = 31; // August
        days_in_month[8] = 30; // September
        days_in_month[9] = 31; // October
        days_in_month[10] = 30;// November
        days_in_month[11] = 31;// Decmeber

        return days_in_month[month];
    }
    /**
     * 
     * @returns JSX for rendering the Calendar cells 
     */
    displayCells = () => {
        /**
         * See if the string is a representation of a number
         * @param {String} str 
         * @returns true if the string represents a number
         */
        const isNumeric = (str) => {
            // If not a string then don't bother processing
            if (typeof str != "string") return false;
            return !isNaN(str);
        }
        /**
         * Genearate a unique key
         * @param {Object} elem 
         * @returns A genarated key
         */
        const generateKey = (elem) => {
            let key1 = 0;
            if (Array.isArray(elem)) {
                if (isNumeric(elem[0])) {
                    key1 = parseInt(elem[0]);
                } else {
                    key1 = Math.random();
                }
            }
            return `${key1}_${Math.random()}_${new Date().getMilliseconds()}`;
        }


        return (
            <div className={styles.calendarContainer}>
                <span className={styles.calendarRow}>
                    {
                        this.weekday_names.map(day => {
                            return (<span key={generateKey(day)} className={styles.weekDayName}>{day}</span>
                            )
                        })
                    }
                </span>
                {this.state.hasLoaded ? (
                    this.state.calendar_cells.map((row, row_index) => {
                        return (
                            <div key={generateKey(row)} className={styles.calendarRow}>{row.map((col, col_index) => {
                                return (
                                    <span key={generateKey(col[Calendar.DAY_NUMBER_INDEX])}
                                        onClick={(e) => this.onClickCalendarCell(col, row_index, col_index)}
                                        className={col[Calendar.IS_DAY_SSELECTED_INDEX] ? styles.selectedCell : styles.calendarCell}>
                                        {col[Calendar.DAY_NUMBER_INDEX]}
                                        <ul key={generateKey(col[Calendar.ITEM_LIST_INDEX])} className={styles.calendarCellItemList}>
                                            {
                                                col[Calendar.ITEM_LIST_INDEX].map(item => {
                                                    return (
                                                        <li key={item.title + generateKey(item.title)}>
                                                            {<TaskListItem key={item.title + generateKey(item.status)} status={item.status} priority={item.priority} title={item.title} />}
                                                        </li>
                                                    )
                                                })
                                            }
                                        </ul>
                                    </span>)
                            })}</div>
                        );
                    })

                ) : (
                    <Container className={appStyles.Content}>
                        <Asset spinner />
                    </Container>
                )
                }
            </div>
        );
    }
    render() {
        return <>
            {this.controlPanel()}
            {this.displayCells()}
        </>
    }
}

export default Calendar;