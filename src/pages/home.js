import React, { useEffect } from "react";

const Home = () => {
    useEffect(() => {
        document.title = "Home";
    }, []
    );
    return (
        <>
            <h1>Organizer</h1>
            <h2>Task Management</h2>
            <p>Organizer helps users to organize their tasks,
                such as chores, errands and work-related matters.
                The tasks can be prioritized so one can see which ones are urgent, which still have time.
            </p>
            <h2>Forming Teams</h2>
            <p>Users can form teams. Team leaders / owners can assign task to their teammates</p>
            <p>One can use the Team chat to exchange messages</p>
            <h2>Manual</h2>
            <h3>Create Task</h3>
            <ol>
                <li>
                    Go to <b>Tasks</b> in the <b>Navigation Bar</b>.
                </li>
                <li>
                    Select a day on the calendar which the task should be added to.
                    Otherwise, the current day will be selected.
                </li>
                <li>
                    An icon with a <b>plus sign</b> will appear in the left corner of Navigation Bar.
                </li>
                <li>
                    Click on that icon.
                </li>
                <li>
                    A page for creating a new Task appears
                </li>
                <li>
                    Name the task.
                </li>
                <li>
                    Choose date if deviates from the one that was picked in the calendar. Also, set time of day if necessary.
                </li>
                <li>
                    Leave a comment on the task (optional).
                </li>
                <li>
                    Choose category of task (chore, errand, work)
                </li>
                <li>
                    Choose priority of task (high, middle, low)
                </li>
                <li>
                    Choose status of task (open, progressing, done)
                </li>
                <li>
                    Choose an image to attach to the task (optional)
                </li>
                <li>
                    Click on save
                </li>
                <li>
                    The task appears in the calendar. The task will also appear in
                    the list of tasks below the calendar, if it is on the same day that
                    was picked in the calendar.
                </li>
            </ol>
            <h3>List of tasks</h3>
            <p>To display a list of tasks, click on tha <b>Tasks</b> Icon in the <b>Navigation Bar</b></p>
            <h4>Select the entire month</h4>
            <p>To show tasks for the entire month, click on the middle button in the calendar,
                that bears the name of the month and year </p>
            <h3>List of Teams</h3>
            <p>To display a list of Teams, click on tha <b>Teams</b> Icon in the <b>Navigation Bar</b></p>
            <h4>Create New Team</h4>
            <ol>
                <li>Click on tha <b>Teams</b> Icon in the <b>Navigation Bar</b></li>
                <li>An icon with a <b>plus sign</b> will appear in the left corner of Navigation Bar.</li>
                <li>A page for creating a new Team opens</li>
                <li>Name the team</li>
                <li>Click on save</li>
            </ol>
            <h4>Join Teams</h4>
            <ol>
                <li>Click on tha <b>Teams</b> Icon in the <b>Navigation Bar</b></li>
                <li>A list of Teams appears on the page</li>
                <li>Click on join button on one of the teams</li>
            </ol>
            <h4>Leave Teams</h4>
            <ol>
                <li>Click on tha <b>Teams</b> Icon in the <b>Navigation Bar</b></li>
                <li>A list of Teams appears on the page</li>
                <li>Click on leave button on one of the teams</li>
            </ol>
            <h4>Team Chat</h4>
            <ol>
                <li>Click on tha <b>Teams</b> Icon in the <b>Navigation Bar</b></li>
                <li>A list of Teams appears on the page</li>
                <li>Click on chat button on one of the teams</li>
                <li>The team chat page appears</li>
            </ol>
        </>
    )
};

export default Home;