const express = require('express')
const path = require('path')

const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const app = express()
app.use(express.json())
const dbpath = path.join(__dirname, 'cricketTeam.db')

let db = null

const Initializedbserver = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server running at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`DB Error: ${e.message}`)
    process.exit(1)
  }
}
Initializedbserver()

//to get players
app.get('/players/', async (request, response) => {
  const playerQuery = `
    select * from cricket_team order by player_id;`
  const playersarray = await db.all(playerQuery)
  response.send(playersarray)
})

//to post new player
app.post('/players/', async (request, response) => {
  const playerDetails = request.body
  const {playerId, playerName, jerseyNumber, role} = playerDetails
  const addplayerQuery = `
  insert into cricket_team(player_id,player_name,jersey_number,role)
  values(${playerId},'${playerName}',${jerseyNumber},'${role}');`
  const dbResponse = await db.run(addplayerQuery)
  response.send('Player Added to Team')
})
