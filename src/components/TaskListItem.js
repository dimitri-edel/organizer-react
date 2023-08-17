import React from "react";
import styles from "../styles/TaskListItem.module.css";

const TaskListItem = ({ title, priority, status }) => {
    let classNames = [];
    const getClassNames = () => {
        if (!isNaN(priority) && !isNaN(status)) {
            switch (priority) {
                case 0:
                    classNames[0] = styles.HighPriorityItem;
                    break;
                case 1:
                    classNames[0] = styles.MidiumPriorityItem;
                    break;
                case 2:
                    classNames[0] = styles.LowPriorityItem;
                    break;
            }

            switch (status) {
                case 0:
                    classNames[1] = styles.StatusOpen;
                    break;
                case 1:
                    classNames[1] = styles.StatusProgressing;
                    break;
                case 2:
                    classNames[1] = styles.StatusDone;
                    break;
            }
        }
    }

    getClassNames();

    return (
        /* render only the first word in the title */
        <span className={classNames.join(" ")}>
            {title.split(" ")[0]}
        </span>
    );
};

export default TaskListItem;