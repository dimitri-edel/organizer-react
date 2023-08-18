import React from "react";
import { Container} from "react-bootstrap";
import styles from "../styles/Calendar.module.css";
import TaskListItem from "./TaskListItem";
import { axiosReq } from "../api/axiosDefaults";
import Asset from "../components/Asset";
import appStyles from "../App.module.css";

class Calendar extends React.Component {
    constructor(props) {
        super(props);
        let current_date = new Date();
        this.setQuery = props.setQuery;
        // this.setSelectedMonthLoaded = props.setSelectedMonthLoaded;
        // this.selectedMonthTaskList = [];
        // this.setSelectedMonthQuery = "";
        // The first weekday must be blank, so we have natural numbers for weekdays(1,2,3,etc)
        this.weekday_names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        // Names of months that will be used in the control panel
        this.month_names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        this.state = {
            // Set the current date
            current_date: current_date,
            // Set the selected date, year and month to the current date
            selected_date: current_date,
            selected_month: current_date.getMonth(),
            selected_year: current_date.getFullYear(),
            selected_month_name: this.month_names[current_date.getMonth()],
            calendar_cells: [],
            selectedMonthTaskList: { results: [] },
            selectedMonthQuery: "",
            hasLoaded: false,
        };
    }

    componentDidMount() {

        this.setState({selectedMonthQuery:  this.getSelectedMonthQuery()});
        this.#fetchSelectedMonth();
    }

    initMonth = () => {
        this.#setMonth(this.state.selected_month, this.state.selected_year);        
    }
    // Fetch all tasks in the given month. The selected month will be passed to this object
    // by the instance of the Calendar
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

    getSelectedMonthQuery = () => {
        const getDateNumberRepresentaion = (num) => {
            if (num < 10) {
                return `0${num}`;
            }
            return num;
        }
        let year = this.state.selected_year;
        let month = getDateNumberRepresentaion(this.state.selected_month + 1);

        return `${year}-${month}`;
    }

    controlPanel = () => {
        const left_icon = "fa-solid fa-angle-left";
        const right_icon = "fa-solid fa-angle-right";
        return (
            <>
                <div className={styles.calendarControlPanel}>
                    <button onClick={this.onClickPrevMonth}>
                        <i className={left_icon}></i>
                    </button>
                    <p>{this.state.selected_month_name} {this.state.selected_year}</p>
                    <button onClick={this.onClickNextMonth}>
                        <i className={right_icon}></i>
                    </button>
                </div>
            </>
        )
    }

    onClickPrevMonth = () => {
        // Display the loading spinner, and call the calculate previous month method (#calculatePrevMonth)
        this.setState({
            hasLoaded: false,
        }, this.#calculatePrevMonth);

    }

    onClickNextMonth = () => {
        // Display the loading spinner, and call the calculate next month method (#calculateNextMonth)
        this.setState({
            hasLoaded: false,
        }, this.#calculateNextMonth);
    }

    onClickCalendarCell = (cell) => {
        // See if the string is a representation of a number
        const isNumeric = (str) => {
            // If not a string then don't bother processing
            if (typeof str != "string") return false;
            if (str === "") return false;
            return !isNaN(str);
        }

        const getDateNumberRepresentaion = (num) => {
            if (num < 10) {
                return `0${num}`;
            }
            return num;
        }


        let year = this.state.selected_year;
        let month = getDateNumberRepresentaion(this.state.selected_month + 1);

        if (isNumeric(cell)) {
            let query = `${year}-${month}-${getDateNumberRepresentaion(cell)}`;            
            this.setQuery(query);
        }
    }

    #calculatePrevMonth = () => {
        let current_month = this.state.selected_month;
        if (current_month === 0) {
            this.setState((prevState, props) => ({
                selected_month: 11,
                selected_year: prevState.selected_year - 1,
                selected_month_name: this.month_names[11],
            }), this.#updateStateDependantElements);
        } else {
            this.setState((prevState, props) => ({
                selected_month: prevState.selected_month - 1,
                selected_month_name: this.month_names[prevState.selected_month - 1]
            }), this.#updateStateDependantElements);
        }
    }

    #calculateNextMonth = () => {
        let current_month = this.state.selected_month;
        if (current_month === 11) {
            this.setState((prevState, props) => ({
                selected_month: 0,
                selected_year: prevState.selected_year + 1,
                selected_month_name: this.month_names[0]
            }), this.#updateStateDependantElements);
        } else {
            this.setState((prevState, props) => ({
                selected_month: prevState.selected_month + 1,
                selected_month_name: this.month_names[prevState.selected_month + 1],
            }), this.#updateStateDependantElements);
        }
    }

    #updateStateDependantElements = () => {
        // this.#setMonth(this.state.selected_month, this.state.selected_year);
        this.setState({
            selectedMonthQuery: this.getSelectedMonthQuery(),
        }, this.#fetchSelectedMonth);

    }
    // Returns true if the year parameter is a leap year
    #isLeapYear(year) {
        return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
    }

    #setMonth = (month, year) => {
        // Determine which weekday is the first day of the month
        let first_day = new Date(year, month, 1);
        // Weekdays are numbered 0-6, 0:Sunday, 1:monday, 2:tuesday, etc.
        let first_week_day = first_day.getDay();
        // Find out how many days in the month
        let last_day_of_month = this.#getLastDayOfMonth(month, year);
        // Create an array representation of calendar cells
        const create_calendar_cells = () => {
            let cells = [];

            for (let row = 1; row < 7; row++) {
                cells[row] = [];
                for (let column = 1; column <= 7; column++) {
                    cells[row][column] = [];
                    cells[row][column][0] = "";
                    cells[row][column][1] = [];
                }
            }

            return cells;
        }

        let cal_cells = create_calendar_cells();

        let day_number = 1;

        // the rows and columns are numbered 1-7
        for (let row = 1; row < 7; row++) {
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
                cal_cells[row][column][0] = day_number.toString();
                // Get the list of tasks for the day and append it to the array
                // month number needs correction, because they start with 0
                cal_cells[row][column][1] = this.#getDaysTaskList(day_number, month + 1, year);
                // Proceed to the next day
                day_number++;
            }
        }
        
        this.setState({ calendar_cells: cal_cells });
    }

    // If there is a list of tasks for this day then return an array with tasks, else return an empty array
    #getDaysTaskList = (day, month, year) => {
        let arr = [];

        // Check if the due_date is the same as the date specified in the parameter list passed to this method
        const isSameDate = (due_date) => {            
            const split = due_date.split(" ");
            const strMonnths = ["Jan", "Feb", "Mar", "Apr", "Jun", "Jul", "May", "Aug", "Sep", "Oct", "Nov", "Dec"];
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

    displayCells = () => {
        // See if the string is a representation of a number
        const isNumeric = (str) => {
            // If not a string then don't bother processing
            if (typeof str != "string") return false;
            return !isNaN(str);
        }

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
                            return (<span key={generateKey(day)}>{day}</span>
                            )
                        })
                    }
                </span>
                {this.state.hasLoaded ? (
                    this.state.calendar_cells.map(row => {
                        return (
                            <div key={generateKey(row)} className={styles.calendarRow}>{row.map(col => {
                                return (
                                    <span key={generateKey(col[0])} onClick={(e) => this.onClickCalendarCell(col[0])} className={styles.calendarCell}>
                                        {col[0]}
                                        <ul key={generateKey(col[1])} className={styles.calendarCellItemList}>
                                            {
                                                col[1].map(item => {
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