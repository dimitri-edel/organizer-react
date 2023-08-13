import React, { createElement, createRef, useRef } from "react";

class Calendar extends React.Component {
    constructor(props) {
        super(props);
       
        // The first weekday must be blank, so we have natural numbers for weekdays(1,2,3,etc)
        this.weekday_names = ["", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        // Names of months that will be used in the control panel
        this.month_names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        this.state = {
            // Set the current date
            current_date: new Date(),
            // Set the selected date, year and month to the current date
            selected_date: new Date(),
            selected_month: new Date().getMonth()+1,
            selected_year: new Date().getFullYear(),
        };
    }

    componentDidMount() {
               
    }

    controlPanel = () => {
        return (
            <>
                <input type="button" value="<<<<" onClick={this.onClickPrevMonth}/>
                <p>{this.state.selected_month} {this.state.selected_year}</p>
                <input type="button" value=">>>>>" onClick={this.onClickNextMonth}/>
            </>
        );
    }

    onClickPrevMonth = () => {
        this.#calculatePrevMonth();
    }

    onClickNextMonth = () => {
        this.#calculateNextMonth();
    }

    #calculatePrevMonth = () => {
        let current_month = this.state.selected_month;
        if (current_month == 0) {
            this.setState((prevState, props) => ({
                selected_month: 11,
                selected_year: prevState.selected_year -1,
              }));
        } else {
            this.setState((prevState, props)=>({selected_month: prevState.selected_month -1}));
        }
    }
    
    #calculateNextMonth = () => {
        let current_month = this.state.selected_month;
        if (current_month == 11) {
            this.setState((prevState, props) => ({selected_month: 0, selected_year: prevState.selected_year+1}));            
        } else {
            this.setState((prevState, props) => ({selected_month: prevState.selected_month +1}));
        }
    }
    

    render() {
        return <>
            {this.controlPanel()};            
        </>
    }
}

export default Calendar;