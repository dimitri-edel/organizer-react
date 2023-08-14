import React, { createElement, createRef, useRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import styles from "../styles/Calendar.module.css";

class Calendar extends React.Component {
    constructor(props) {
        super(props);
        let current_date = new Date();
        this.setQuery = props.setQuery;
        this.selectedMonthTaskList = props.monthTaskList;
        this.setSelectedMonthQuery = props.setSelectedMonthQuery;
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
        };
    }

    componentDidMount() {
        this.#setMonth(this.state.selected_month, this.state.selected_year);
        for (let i = 0; i < this.selectedMonthTaskList.results.length; i++) {
            console.log(this.selectedMonthTaskList.results[i].title);
        }
        this.setSelectedMonthQuery(this.getSelectedMonthQuery());
    }

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
        return (
            <>
                <input type="button" value="<<<<" onClick={this.onClickPrevMonth} />
                <p>{this.state.selected_month_name} {this.state.selected_year}</p>
                <input type="button" value=">>>>>" onClick={this.onClickNextMonth} />
            </>
        );
    }

    onClickPrevMonth = () => {
        this.#calculatePrevMonth();
    }

    onClickNextMonth = () => {
        this.#calculateNextMonth();
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
            console.log(`${cell}. ${this.month_names[this.state.selected_month]} ${this.state.selected_year}`);
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
        this.#setMonth(this.state.selected_month, this.state.selected_year);
        this.setSelectedMonthQuery(this.getSelectedMonthQuery());
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
                cal_cells[row][column][1] = this.#getDaysTaskList(day_number, month, year);
                // Proceed to the next day
                day_number++;
            }
        }
        console.log(cal_cells);
        this.setState({ calendar_cells: cal_cells });
    }

    // If there is a list of tasks for this day then return an array with tasks, else return an empty array
    #getDaysTaskList = (day, month, year) => {
        let arr = [];
        for (let i = 0; i < this.selectedMonthTaskList.results.length; i++) {
            arr[i] = this.selectedMonthTaskList.results[i].title;
        }
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
                {this.state.calendar_cells.map(row => {
                    return (
                        <div key={generateKey(row)} className={styles.calendarRow}>{row.map(col => {
                            return (
                                <span key={generateKey(col[0])} onClick={(e) => this.onClickCalendarCell(col[0])}>
                                    {col[0]}
                                    <ul key={generateKey(col[1])} className={styles.calendarCellItemList}>
                                        {
                                            col[1].map(item=>{
                                                return (<li>{item}</li>)
                                            })
                                        }
                                    </ul>
                                </span>)
                        })}</div>
                    );
                })}
            </div>
        );
    }
    render() {
        return <>
            {this.controlPanel()};
            {this.displayCells()}
        </>
    }
}

export default Calendar;