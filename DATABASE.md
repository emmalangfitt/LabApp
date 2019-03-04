# Database
Nosedive relies on Google Firebase for realtime data synchronization. 

### Platform
Google Firebase is a NoSQL cloud-hosted database where data is stored as JSON and synchronized in realtime to every connected client. The app takes advantage of Firebase's API to read data into the app and write updates to the database, or data can be manually altered from the Firebase console. Complete documentation can be found at https://firebase.google.com/docs/.

### Storage Heirarchy
The database must be structured as follows...
```
labapp
--- active: number
--- parties
    ---  1
        --- active: boolean
        --- number: number
        --- noratings: boolean
        --- variedstart: boolean
        --- weightedrankings: boolean
        --- userProfile
            --- userID: string
                --- first: string
                --- last: string
                --- email: string
                --- role: boolean
                --- photo: string
                --- num: number
                --- rating: number
                --- ratings
                    --- array<numbers>
                --- preSurvey
                    --- q1
                    --- q2...
                --- postSurvey
                    --- q1
                    --- q2...
    --- 2
    --- 3...
```

### Breakdown of Subdirectories
- **labapp:** This is the main directory of the app's storage. All data from the app is stored within this bucket. It immediately contains `active`, a number that indicates which party is the active party at the given moment, and a subdirectory of all existing parties called `parties`. 
- **parties:** This subdirectory contains all the existing parties as subdirectories, referred to by number. Parties are automatically numbered in increasing order when added to the app, starting with number one.
- **individual party subdirectory:** Each party is its own directory containing all the data needed to run the app under that party's conditions. This subdirectory contains...
  - `active`: a boolean that is true if that party is the current active party
  - `number`: the number of the party, matching the directory title
  - `noratings`: a boolean that is true if users cannot rate other users of the app
  - `variedstart`: a boolean that is true if users start with ratings equally distributed between 1 and 6
  - `weightedrankings`: a boolean that is true if highly rated users have more impact on the ratings of other users
  - `userProfile`: a subdirectory of all the users registered under that active party
- **userProfile:** Within each party, this subdirectory holds all the users registered under that party and their associated data. This includes... 
  - `first`: a string of the user's first name
  - `last`: a string of the user's last name
  - `email`: a string of the user's email
  - `role`: a boolean that is true if user is an admin
  - `photo`: a string indicating the storage location of the user's photo
  - `num`: a number indicating the user's participant number (between 1 and 30)
  - `rating`: a number indicating the user's current own rating
  - `ratings`: a list of numbers indicating which other users have been rated by the current user (index 12 contains a 0 if the current user has not rated participant 12 and a 1 if they have within the last time frame)
  - `preSurvey`: a subdirectory of the user's answers to the pre-survey, data types depend on the questions asked but entries are titled `q1, q2, q3...`
  - `postSurvey`: a subdirectory of the user's answers to the post-survey, data types depend on the questions asked but entries are titled `q1, q2, q3...`

### Privacy
Firebase allows the owner of a database to set privacy rules. At minimum, Nosedive's database requires the user to be authenticated with the app to access data of any kind. Beyond this, users only have write access to data under their own subdirectory and read access to other users' names and ratings. This ensures that the experiment's survey and consent responses are not shared between users of the app.
