# Nosedive
A cross-platform app for use in research experiments on reputation effects in social interactions.

### Overview of Project
#### Inspiration
Ant Financial implemented the Zhima (Sesame) Credit System in China in 2015, using data from Alibaba’s variety of resources, including purchases and social media connections, to derive a national social credit system. The Chinese government hopes that, as the system expands and gains traction across the country, it will effectively govern the civil behavior of its citizens. The quality of each individual’s credit rating determines their access to bank loans and certain private schools, and can result in discounts or bans from airlines, trains, and hotels. In theory, the significant influence of these social credit ratings should motivate individuals to seek self-improvement through a moral and commendable lifestyle. However, the effects of such a system could affect the overall quality of life of its members. As portrayed in a 2016 episode of the Netflix series *Black Mirror* titled "Nosedive," a  social credit rating system can play on modern society’s obsession with social comparisons and reputation to have severe consequences on social relationships. The implications enforce a national culture of judgment with both incentives and consequences that could alter the way people approach social interactions. This dystopian depiction of a hypothetical social credit system acts as the main motivation for a set of experiments on reputation effects in social interactions, and this app, created for use in these experiments, takes inspiration from the social rating app portrayed in the episode. 

#### Purpose
This app will be used in research experiments on reputation effects in social interactions. In each experiment, up to thirty participants will engage in a simulated social gathering. After signing informed consent forms and setting up a device with the app, participants will then mingle throughout the room and rate the other participants after interacting with them. Participants then complete an evaluation survey that asks the participants to rate their experience in terms of multiple social experience factors, including quality, length of conversation, and sincerity.

The app also allows an admin account to change party settings that correlate to different experimental conditions. There are three aspects of the experiment the admin can manipulate through the app: the ability to rate others, the participants' initial ratings, and the weightedness of the averaging equation. In the control trials, users will interact in the social setting without rating the other participants, so the app will block users in this condition from the rating screen. The app can also determine if all users begin at a neutral rating of 2.5, or if they begin evenly distributed between the lowest (1) and the highest (5) rating. Finally, the admin can determine if all new ratings are simply averaged into the user's existing rating or if the rating of the rater weights the average, giving users with higher ratings more influence on the ratings of other users. These conditons are set when the admin adds a new party.

#### Tools
- *Ionic:* This app utilizes the Ionic Framework for building cross-platform hybrid apps, allowing it to function as both a mobile and web app. This framework is built on Angular and leverages Cordova for mobile device functionality. Full documentation can be found at https://ionicframework.com.
- *Firebase:* The app also uses Googles Firebase for user authentication and data storage. Users can sign up with an email and password, which is stored in Firebase for future authentication. The realtime database then synchronizes application data across iOS, Android, and Web devices, and stores it on Firebase's cloud. This allows user ratings to update in realtime based on interactions users have during the party. Firebase also allows the admin to restrict read and write permissions on the database, so participant data can be safely kept in the Firebase cloud. Full documentation can be found at https://firebase.google.com.


### How It Works
#### User Functionality

#### Admin Functionality


### File Structure


### Authentication and Database Services


### Hosting the App


### Context
