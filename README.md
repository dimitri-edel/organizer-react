# Organizer 
Organizer helps users to organize their tasks, such as chores, errands and work-related matters.
It allows users to form teams and assign tasks to their teammates.

# User Stories

## Registration
An unregistered user can register with the website, so they can use the services provided by the application.

## Login
A registered user can sign in and use the application.

## List Tasks of any given day
An authenticated user can list tasks for any day in the calendar, so they can view what needs to be done on that day.

## List Tasks of an entire month
An authenticated user can list tasks for an entire month, so they can get an overview of the work load of the month.

## Create Tasks
An authenticated user can create new tasks. 
A task must have the following attributes:
- selectable date and time
- selectable category (chore, errand, work)
- selectable priority (high, middle, low)
- selectable status (open, progressing, done)
- possibility to attach an image file
- possibility to assign the task to a teammate

## Filter Tasks
An authenticated user can filter tasks by title, date, category, priority and status, so they can sort them out in an efficient way.

## Edit Tasks
Owners of tasks can edit their tasks, so they can make changes if necessary.

## List Teams
An authenticated user can see the list of teams, so they can find and join any team.

## Create Teams
An authenticated user can create his or her own team, so other members can join them. Own teams allow the user to assign tasks to other team members, so they can delegate task as a team leader.

## Rename Teams
Owners of teams (team leaders) can delegate tasks to other members of their teams, so they can divvy up the work among the team.

## Join Teams
An authenticated user can join teams, so they can collaborate with other people a project. 

## Leave Teams
A member of a team can leave a team, so no more tasks of the team in question can be assigned to them anymore.

## Team Chat
Members of a team can engage in a team chat, so they can exchange information. An image file can be attached to a message.

## Private Chat
Members of a team can exchange private messages, if they can discuss issues that only concern the two of them. An image file can be attached to a message.

## Editable Messages
Owners of messages can edit their messages, so they can change them retrospectively.

## Deletable Messages
Owners of messages can delete their messages, if they become irrelevant or contain false information.

## Libraries 
- **react-bootstrap** is was used, because it offers a quick way to create responsive layout and styling of the components
- **react-bootstrap-datetimepicker** was used because I used bootstrap in this project and I needed a date-picker. However, any other date-picker would have done it.
- **react-infinite-scroll-component** is used for messages in team chat or listing tasks or teams. It offers a quick solution for loading the content dynamically, into a scroll panel. If the user starts scrolling down, then more content is loaded. To load the next chunk of data into the scroll panel, this element uses the **fetchMoreData** function which is defined in **utils.utils.js**. The function calls the next page URL, that is part of data stored in a state variable. **fetchMoreData** can be used for any paginated data.
- **react-toastify** is used to deliver notifications to the user. It is very easy to use and has many features right out of the box.
- **axios** is an easy to use library for processing HTML-requests and HTML-responses.

## Patterns

### Tasks (Listing)
The name of the component is **TaskList** in pages.task.TaskList.js. It harbors the main Component for displaying the task management interface. It is rendered in the **App** component and is mapped to the **route /tasks/**.

#### Diagram of Tasks Page Components

![Task List Components](images_readme/task-list-components-diagram.png)

This diagram depicts how the components are organized inside a task list page.

---

### Create Task
The name of the component is **CreateTaskForm** in pages.task.CreateTaskForm.js. This component is for creating new tasks. It is rendered in the **App** component and is mapped to the **route /tasks/create**.

### Edit Task
The name of the component is **EditTaskForm** in pages.task.EditTaskForm.js. This component is for editing existing tasks. It is rendered in the **App** component and is mapped to the **route /tasks/:id/edit**.

### Teams
The name of the component is **TeamList** in pages.team.TeamList.js. It harbors the main Component for displaying the team management interface. It is rendered in the **App** component and is mapped to the **route /teams/**.

#### Team List Page Components

![Team List Components](images_readme/team-list-components-diagram.png)

This diagram shows how the components on the team list page are organized. The **OR** means that the components are rendered conditionally. If the user clicked on rename on one of the teams then the TeamEditForm will be rendered instead of the Team component.

---

### Create Team
The name of the component is **CreateTeamForm** in pages.team.CreateTeamForm.js. This component is for creating new teams. It is rendered in the **App** component and is mapped to the **route /teams/create**.

### Team
The name of the component is **Team** in pages.team.Team.js. It shows the name of a particular team in the list of teams. It provides a set of control elements such as **rename, delete, join, leave**. This component is embedded in the JSX of **TeamList**. It is wrapped inside a map function of the dictionary with the data from the API. The map function is called by **bootstrap's InfiniteScroll** component.

### Rename Team
The name of the component is **TeamEditForm** in pages.team.TeamEditForm.js. This component is embedded in the JSX of **TeamList**. It will be rendered in place of the respective **Team** component in the list if **EditTeamId** state variable is not null. The state variable **EditTeamId** is declared in the parent component **TeamList**.

### StaticContext in context.StaticContext.js
For educational purposes I created a Component, namely Calendar, as a class Component. The drawback is that one cannot use context hooks in a class component. I decided to use a static context for making the selected date in the calendar globally available. When user selects a day in the calendar and then clicks on the **add Task** menu item in the navigation bar, then the date will be stored in StaticContext.SELECTED_DATE. When the form for creating new tasks is rendered the selected date is used as the initial value for the due date of a task. 

### Team Chat

The name of the component is **TeamChat** in pages.team.TeamChat.js. It harbors the main Component for displaying a chat room. It is rendered in the **App** component and is mapped to the **route /team-chat/:team_id/**.
This component renders three child-components: TeamChatFilters, TeamMessageBoard and TeamMessagePostForm.
It uses a constant team_id, which is a parameter in the URL route and signifies the private key of the team.
It uses a state variable named **reload**, which is a boolean flag that signals whether or not the content of the message board must be reloaded. If set to true, the message board will reload the list of messages on the board. The reason for this flag being declared in the parent component is so components other than the message board can trigger a reload of the messages. It is basically an event pattern.

#### Diagram of Team Chat Page Components
![Team Chat Components](images_readme/team-chat-components-diagram.png)

The names in the picture are the names of components used to render a chat room.
The **OR** means that either one component is rendered or the other. The rendering is conditional.

---
#### Side Bar
The Name of the component is **TeamChatSideBar** in pages.team.TeamChatSideBar.js. The purpose of this component is to show all members of a particular team. Clicking on a username in the sidebar will open a private chat with that user.

#### Filters
The Name of the component is **TeamChatFilters** in pages.team.TeamChatFilters.js. The purpose of this component is to search the messages by username or keywords in a message. It also allows to filter the messages by how long ago they were posted. Current possibilities are (All, Since yesterday, 1 Week, 2 Weeks, 3 Weeks).  More filters can be easily added by changing the **value** of an **option** to the number of days that the messages should go back.

#### Team Message Board
The Name of the component is TeamMessageBoard in pages.team.TeamMessageBoard.js. It renders a list of messages within a team.
To load the messages a **request** to the **API** is issued and the data gets extracted from the response.I used the **useEffect** hook with a closure (nested function) named **fetchMessages**.
Each **Message** is a component of type **TeamMessage**. 
If a message has been picked for **editing**, then a **TeamMessageEditForm** will be rendered instead of the message itself. This allows the user to update the message.
State variable **messages** holds the data fetched from the API.
State variable **hasLoaded** is a boolean flag that is set to true by **fetchMessages** as soon as the data is loaded from the Response.
State variable **editMessageId** holds the private key of a message if the user clicks on the edit button on that message. If no message is being edited then the flag must be set to false. Since the edit button is part of the **TeamMessage** component, the **setEditMessageId** setter function is passed down to that component.
The **checkForMessages** function is triggered at three second intervals to make sure that new messages from other team members are displayed as soon as they post them. The **intervals** are set inside the **useEffect** hook.

#### Team Message Post Form
The name of the component is **TeamMessagePostForm** in pages.team.TeamMessagePostForm.js. It provides an interface for posting new messages. The post request is sent to the API URL **"team-chat-post/?team_id?**. It attaches a form to the request. The request is handled inside the **handleSubmit** function.

#### Private Message Board
PrivateMessageBoard is a function that renders a list of messages within a team.
To load the messages a **request** to the **API** is issued and the data gets extracted from the response.I used the **useEffect** hook with a closure (nested function) named **fetchMessages**.
Each **Message** is a component of type **PrivateMessage**. 
If a message has been picked for **editing**, then a **PrivateMessageEditForm** will be rendered instead of the message itself. This allows the user to update the message.
State variable **messages** holds the data fetched from the API.
State variable **hasLoaded** is a boolean flag that is set to true by **fetchMessages** as soon as the data is loaded from the Response.
State variable **editMessageId** holds the private key of a message if the user clicks on the edit button on that message. If no message is being edited then the flag must be set to false. Since the edit button is part of the **PrivateMessage** component, the **setEditMessageId** setter function is passed down to that component.
The **checkForMessages** function is triggered at three second intervals to make sure that new messages are displayed as soon as they are posted by the other team member. The **intervals** are set inside the **useEffect** hook.

#### Private Message Post Form
The name of the component is **PrivateMessagePostForm** in pages.team.PrivateMessagePostForm.js. It provides an interface for posting new messages. The post request is sent to the API URL **"private-chat-post/?team_id?**. It attaches a form to the request. The request is handled inside the **handleSubmit** function.

#### User notifications
The name of the component is **ToastContainer**, which is provided by the library **react-toastify**. It is embedded in index.js right next to the **App** container. The messages can be displayed at any point by using the **toast** function from the library, that needs to be imported into the js file that intends to use it. The function takes a set of parameters such as the message itself. The list of parameters also includes many other features that control the look and behavior of the component. This page provides a great way to do this [react-toastify-page](https://fkhadra.github.io/react-toastify/introduction). One can choose all the options on the page and will see what it is going to look like and will also see a code snippet of the function call that corresponds to all the settings that one provided. Just copy, paste, change the message and Bob's your uncle.

# Manual Tests
## List Tasks Test
## Create Tasks Test
## Filter Tasks Test
## List Teams Test
## Create Teams Test
## Rename Teams Test
## Join Teams Test
## Leave Teams Test
## Open Team Chat Test
## Post Message in Team Chat Test
## Edit Message in Team Chat Test
## Delete Message from Team Chat Test
## Open Private Chat Test
## Post Message in Private Chat Test
## Edit Message in Private Chat Test
## Delete Message from Private Chat Test

# Deployment on Heroku
