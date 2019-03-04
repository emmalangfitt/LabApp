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
        --- varied start: boolean
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

### Privacy
