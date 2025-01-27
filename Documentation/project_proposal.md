# Vision Statement

The “personal finance manager” will be used by teenagers and adults in order to keep track of their financial spending, providing unique customized insights and displaying them in visually interesting and simple to understand ways. 

# Project Summary

Managing personal finances can often be tedious and feel overwhelming. The goal of “personal finance manager” is to simplify this process by empowering users to make informed financial decisions. Individuals who find keeping track of their finances taxing would benefit from using our application. Our application provides a simpler, straightforward way of presenting financial data, making it easier to understand and gain valuable insights.

The “personal finance manager” will be a web application that aids users in keeping track of their financial data. It enables users to record transactions and retrieve them easily when needed. There will be many ways to search specific transactions or groups of transactions such as filtering on a specific category “food”. This helps reduce the amount of unnecessary scrolling the user might need to do to find specific transactions. In addition, users can generate a variety of charts to visualize their financial data, enabling better insights and smarter financial decisions. The application also allows users to establish financial goals and monitor their progress over time. Finally, users can set reminders for upcoming bills so that they don’t miss future payments.

Our success criteria for the “Personal finance manager” is to achieve 1000 registered users within the first 3 months of launch. The application is designed to ensure users can record a transaction in under 10 seconds, providing a seamless and efficient experience. Additionally, it will support concurrent usage by at least 20 users handling up to 200 requests per minute, ensuring robust performance under high demand.

# Core Features
User Profile
* Users will be able to create an account to sign into for their own personalized data. Users can also reset their password if they forget it

Display of Stats
* Allows users to create visualizations such as different charts of the data they have.

Transaction Management
* Allows users to create, edit, delete, filter and search different transactions

Schedule reminders for upcoming bills
* Allows users to set reminders for upcoming bills that are due such as things like monthly subscriptions

Goals for the Future
* Allows users to set financial goals that they can track

Scalability (non functional feature)
* System can withstand a large number of users sending a large number of requests in a short time frame.

Technologies
* DB: MongoDB
* Front End: React
* Logic: NodeJS + ExpressJS
* Code Styling: ESLint

# User Stories for Core Features
User Profile
* As a user, I should be able to create a personal account by using username and password, so that the system can remember me and my data.
* As a user, I need to be able to sign in to my account so that I can access all my data in the account.
* As a user, I should be able to change my password, so that I can still login into my account when I get lost. / still need to figure out the security part (maybe security questions or if left time can try email).
* As a logged in user, I want to logout of my account so that my account remains secure.

Display of Stats
* As a user, I should be able to view a summary table of my income and spending, so that I can understand my balance better.
* As a user, I should be able to view a pie chart of my spending categories, so that I can understand where most of my money is going.
* As a user, I should be able to see a bar chart of my monthly income vs expenses, so that I can track my financial balance.

Transaction Management
* As a user, I should be able to search for specific transactions, so that I can quickly find relevant details.
* As a user, I want to be able to filter out transactions specific to certain categories like food, subscriptions, so that I can better keep track of how much I am spending for specific food or subscriptions
* As a user, I should be able to add a new transaction, so that my spending and income are always up to date.
* As a user, I should be able to edit or delete transactions, so that I can correct errors or remove duplicates.

Schedule reminders for upcoming bills
* As a user, I want to be able to set reminders for bill payments or subscriptions so that I don’t miss the payment due date
* As a user, I want to be able to receive a notification for the reminder I set so I know that the payment is due	
* As a user, I want to be able to remove reminders that I no longer need so I don’t get unnecessary notifications for something I no longer am interested in.

Goals for the Future
* As a user, I should be able to create financial goals (e.g., saving $1,000), so that I can work toward achieving them.
* As a user, I should be able to track my progress toward a goal, so that I stay motivated.
As a user, I should be able to receive notifications about my progress, so that I stay on track.

Scalability
* As a system admin, I want the system to respond to 20 users concurrently handling a total of 200 requests per minute so that the system remains reliable under many users.


