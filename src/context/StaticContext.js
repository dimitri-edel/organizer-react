import React from "react";


/**
 * Calendar allows the user to select a month or day, which will be used to display tasks
 * of the selected month or day. It also displays a miniature task list for each day underneath
 * the day number.
 */
class StaticContext extends React.Component {
    /**
    *    @static
    *    @property
    *    SELECTED_DATE signigies which date the user picked in the calendar
    *    and is only used when creating a new task
    */
    static SELECTED_DATE = null;
    /**
    *    @static
    *    @property
    *    SELECTED_MONTH signigies which month the user picked in the calendar
    *    and is only used when creating a new task
    */
    static SELECTED_MONTH = null;
    /**
    *    @static
    *    @property
    *    SELECTED_YEAR signigies which year the user picked in the calendar
    *    and is only used when creating a new task
    */
    static SELECTED_YEAR = null;

    constructor(props) {
        super(props);
    }
}


export default StaticContext;