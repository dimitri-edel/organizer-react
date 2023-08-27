# Organizer 
Organizer helps users to organize their tasks, such as chores, errands and work-related matters.
It allows users to form teams and assign tasks to their teammates.

## UER SOTRIES
---
### Registration
![registration image](images_readme/singnup.png)

If the registration was successful, then the user is forwarded to the login page.
---
#### Validation
If one of the password fields is left empty

![registration empty password image](images_readme/singnup_validation_blank.png)

If the password is not valid

![registration invalid password](images_readme/singnup_validation_password.png)

If the username is already exists

![registration username taken image](images_readme/singnup_validation_username.png)

---
### Login
![signin form image](images_readme/signin.png)

---
### Logout
Click or tap on Sign out in the navigation menu
![signout image](images_readme/signout.png)

---
### Create Team

![create team form image](images_readme/create_team_form.png)

If the team was created successfully the user will be forwarded to the page with the list of teams.

---
### Rename Team
Updating the team is just a renaming function. It allows users to rename their teams. 
To rename the team click on **Teams** in the navigation menu. Once the List of teams
appears on screen. Go to the search bar and type in the first sequence of letters in
the name of the team, so it can be found more quickly. 

![updating team name image step#1](images_readme/rename_team_step1.png)

As soon as you can see the team,
you will also see that their is a button that reads **Rename**. Tap on that button and a
window will open that allows you to rename it. When done, click on **Save**.

![updateing team name image step#2](images_readme/rename_team_step2.png)

---
### Delete Team
To delete the team click on **Teams** in the navigation menu. Once the List of teams
appears on screen. Go to the search bar and type in the first sequence of letters in
the name of the team, so it can be found more quickly. 

![deleting team name image step#1](images_readme/rename_team_step1.png)

Now simply click on the delete button on the team.


---
### View List of Teams
To see a list of teams click on **Teams** in the navigation menu. Once the List of teams
appears on screen. Go to the search bar and type in the first sequence of letters in
the name of the team or the username whose teams you want to be listed, so it can be found more quickly. 

---
### Joining or Leaving Teams
To see a list of teams click on **Teams** in the navigation menu. Once the List of teams
appears on screen. Go to the search bar and type in the first sequence of letters in
the name of the team or the username whose teams you want to be listed, so it can be found more quickly. 

![joining or leaving teams image](images_readme/joining_leaving_teams.png)

Teams that the user has already joined have a **Leave** button.
Teams that the user is not a member of have a **Join** button.

---
#### Search Teams
To see a list of teams click on **Teams** in the navigation menu. Once the List of teams
appears on screen. Go to the **search bar** and type in the first sequence of letters in
the name of the team or the username whose teams you want to be listed, so it can be found more quickly. 

---
### Create Task
On the **navigation bar** click on the Link that says **+ Task**.

![create task form image](images_readme/create_task_form_1.png)

1. Name the task
2. Choose date and time on which the task is due
3. Choose Category
4. Choose Priority
5. Choose Status
7. Choose an image file that you want to upload. This field is optional.
8. Type in a comment for the task. This field is optional.
9. Click on Create

---
### Update Task

---
#### Validation

---
### Delete Task

---
### View List of Tasks
On the **navigation bar** inside the **navigation menu**  click on **Teams**. A Calendar will appear. Underneath the calendar
is a list of tasks. At first you will see a list of tasks for the current day, provided that there are any tasks for the day.
To select the **entire month** simply click on the button that reads the month and year of the current month, which lives in
the top row of the calendar. Also, you you wish to selct a **particular day** just click on that day in the calendar. Inside, 
the calendar you can see an abbrivated list of tasks inside each box with the day number, given the fact that there are any 
tasks planned for that day. Underneath the calendar you will find a **search bar** that will have either the current date inside 
it like : "2023-08-27" or if you clicked on the monthname in the calendar it will simply read "2023-08". Which means that the task
list below shows entries for that day or month. However that search-bar also allows you to search tasks by their title as well.
Furthermore, underneath the search-bar is a set of filters by which you can filter the results as well.

![task list image](images_readme/task_list_1.png)

---
## Testing
---

### Test Registration

---
### Test Login

---
### Test Logout

---
### Test Creating Teams
Validation

---
### Test Updating Teams
Validation

---
### Test Deleting Teams

---
### Test Listing Teams

---
#### Test Searching Teams
- Filters


---
### Test Joining Teams

---
### Test Leaving Teams

---
### Test Creating Tasks
- assign task to teammates
- Validation
---
### Test Updating Tasks
- Validation

---
### Test Deleting Tasks

---
### Test Listing Tasks

Search field
Filters

---

### Deployment on heroku
The repository already contains the Procfile, that is the only thing that heroku will need to build the application.
All that is necessary to do is go to the dashboard and create a new app, that uses a github repository. Specify this 
repository and go to Deploy tab. Then click on **Deploy branch**. 

## BUGS
## Signin Form
Validation fields are not showing the response from API